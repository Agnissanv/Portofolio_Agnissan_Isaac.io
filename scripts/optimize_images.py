#!/usr/bin/env python3
# ============================================================
# Code A-Z — optimize_images.py            (npm run images)
# Convertit en WebP toutes les images PNG/JPG qui sont utilisées par le site,
# met à jour les références, puis supprime les originaux.
#
#  - Galeries de projets      -> <nom>.webp                (1600 px max)
#  - Vignette de projet       -> <nom>-thumb.webp (4:3, 720 px) + <nom>-og.jpg (partage)
#  - Couverture d'article     -> <nom>.webp + <nom>-thumb.webp + <nom>-og.jpg
#  - Couverture d'ebook       -> <nom>.webp
#
# Sources lues : js/projects-data.js, content/posts/*.md, content/ebooks/*.json
# Dossiers traités : images/projets, images/blog, downloads/ebooks
#   Option --all : convertit aussi les images pas encore référencées.
# Prérequis : Python + Pillow  (pip install pillow)
# Ensuite : npm run build
# ============================================================
import io, json, os, re, sys
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIRS = ("images/projets/", "images/blog/", "downloads/ebooks/")
MAX_W, QUALITY, THUMB_W, OG_SIZE = 1600, 80, 720, (1200, 630)
RASTER = re.compile(r"\.(png|jpe?g)$", re.I)


def rd(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def wr(rel, text):
    with open(os.path.join(ROOT, rel), "w", encoding="utf-8") as f:
        f.write(text)


def eligible(p):
    return p.startswith(DIRS) and RASTER.search(p) and os.path.exists(os.path.join(ROOT, p))


def collect():
    """chemin -> ensemble de rôles : gallery, thumb, blogcover, ebookcover"""
    roles = {}

    def add(p, r):
        roles.setdefault(p, set()).add(r)

    js = rd("js/projects-data.js")
    for m in re.finditer(r'thumb:\s*"([^"]+)"', js):
        add(m.group(1), "thumb")
    for block in re.finditer(r"gallery:\s*\[(.*?)\]", js, re.S):
        for m in re.finditer(r'"([^"]+)"', block.group(1)):
            add(m.group(1), "gallery")
    for f in sorted(os.listdir(os.path.join(ROOT, "content/posts"))):
        m = re.search(r'^cover:\s*"([^"]+)"', rd("content/posts/" + f), re.M)
        if m:
            add(m.group(1), "blogcover")
    for f in sorted(os.listdir(os.path.join(ROOT, "content/ebooks"))):
        c = json.loads(rd("content/ebooks/" + f)).get("cover")
        if c:
            add(c, "ebookcover")
    if "--all" in sys.argv:  # aussi les images pas encore utilisées (converties, références inchangées)
        for base in DIRS:
            for d, _, fs in os.walk(os.path.join(ROOT, base)):
                for f in fs:
                    rel = os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, "/")
                    if RASTER.search(rel) and not re.search(r"-(thumb|og)\.(webp|jpe?g)$", rel):
                        roles.setdefault(rel, set()).add("gallery")
    return {p: r for p, r in roles.items() if eligible(p)}


def prepare(im):
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        return im.convert("RGBA")
    return im.convert("RGB")


def crop_ratio(im, ratio, top=False):
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / ratio)
    y = 0 if top else (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def save_webp(im, rel, width):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(ROOT, rel), "WEBP", quality=QUALITY, method=6)


def save_og(im, rel, top):
    im = crop_ratio(im, OG_SIZE[0] / OG_SIZE[1], top=top)
    if im.mode == "RGBA":
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        im = bg
    im = im.resize(OG_SIZE, Image.LANCZOS)
    im.save(os.path.join(ROOT, rel), "JPEG", quality=82, optimize=True, progressive=True)


def ensure_cover_variants():
    """Couvertures d'article déjà en .webp : génère -thumb.webp et -og.jpg s'ils manquent."""
    n = 0
    for f in sorted(os.listdir(os.path.join(ROOT, "content/posts"))):
        m = re.search(r'^cover:\s*"([^"]+\.webp)"', rd("content/posts/" + f), re.M)
        if not m or not os.path.exists(os.path.join(ROOT, m.group(1))):
            continue
        base = m.group(1)[:-5]
        im = None
        for rel, fn in ((base + "-thumb.webp", lambda i: save_webp(i, base + "-thumb.webp", THUMB_W)),
                        (base + "-og.jpg", lambda i: save_og(i, base + "-og.jpg", top=False))):
            if not os.path.exists(os.path.join(ROOT, rel)):
                im = im or prepare(Image.open(os.path.join(ROOT, m.group(1))))
                fn(im)
                n += 1
                print("variante créée :", rel)
    return n


def main():
    roles = collect()
    made_variants = ensure_cover_variants()
    if not roles:
        if made_variants:
            print("Étape suivante : npm run build")
            return
        print("Rien à convertir : toutes les images utilisées sont déjà en WebP.")
        return
    # Sécurité : deux fichiers ne doivent pas viser le même nom .webp
    targets = {}
    for p in roles:
        t = RASTER.sub(".webp", p)
        if t in targets:
            sys.exit(f"Conflit de nom : {p} et {targets[t]} donneraient {t}")
        targets[t] = p

    mapping, before, after = {}, 0, 0
    for p, r in sorted(roles.items()):
        src = os.path.join(ROOT, p)
        base = RASTER.sub("", p)
        im = prepare(Image.open(src))
        made = []
        thumb_only = "thumb" in r and not (r & {"gallery", "blogcover", "ebookcover"})
        if not thumb_only:
            save_webp(im, base + ".webp", MAX_W)
            made.append(base + ".webp")
        if "thumb" in r:
            save_webp(crop_ratio(im, 4 / 3), base + "-thumb.webp", THUMB_W)
            save_og(im, base + "-og.jpg", top=True)
            made += [base + "-thumb.webp", base + "-og.jpg"]
        if "blogcover" in r:
            save_webp(im, base + "-thumb.webp", THUMB_W)
            save_og(im, base + "-og.jpg", top=False)
            made += [base + "-thumb.webp", base + "-og.jpg"]
        mapping[p] = (base + "-thumb.webp") if thumb_only else (base + ".webp")
        before += os.path.getsize(src)
        after += sum(os.path.getsize(os.path.join(ROOT, m)) for m in made)
        print(f"{os.path.getsize(src) // 1000:6d} Ko -> {sum(os.path.getsize(os.path.join(ROOT, m)) for m in made) // 1000:5d} Ko  {p}")

    # Mise à jour des références
    js = rd("js/projects-data.js")
    for p, r in roles.items():
        if "thumb" in r:
            thumb_new = RASTER.sub("", p) + "-thumb.webp"
            js = re.sub(r'(thumb:\s*)"' + re.escape(p) + '"', lambda m: m.group(1) + '"' + thumb_new + '"', js)
        if "gallery" in r:
            js = js.replace('"' + p + '"', '"' + RASTER.sub(".webp", p) + '"')
    wr("js/projects-data.js", js)
    for f in os.listdir(os.path.join(ROOT, "content/posts")):
        rel = "content/posts/" + f
        t = rd(rel)
        n = re.sub(r'^(cover:\s*")([^"]+)(")', lambda m: m.group(1) + RASTER.sub(".webp", m.group(2)) + m.group(3) if m.group(2) in roles else m.group(0), t, flags=re.M)
        if n != t:
            wr(rel, n)
    for f in os.listdir(os.path.join(ROOT, "content/ebooks")):
        rel = "content/ebooks/" + f
        t = rd(rel)
        j = json.loads(t)
        if j.get("cover") in roles:
            j["cover"] = RASTER.sub(".webp", j["cover"])
            wr(rel, json.dumps(j, ensure_ascii=False, indent=2) + "\n")

    # Suppression des originaux (l'historique git les conserve)
    for p in roles:
        os.remove(os.path.join(ROOT, p))
    print(f"\n{len(roles)} image(s) traitée(s) : {before / 1e6:.1f} Mo -> {after / 1e6:.1f} Mo")
    print("Étape suivante : npm run build")


if __name__ == "__main__":
    main()
