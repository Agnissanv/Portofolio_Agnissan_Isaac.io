<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Récupération et nettoyage des données (Sécurité)
    $nom = strip_tags(trim($_POST["lastname"]));
    $prenom = strip_tags(trim($_POST["firstname"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($_POST["message"]));

    // 2. Vérification des champs
    if (empty($nom) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Oups ! Il y a eu un problème avec votre soumission. Veuillez réessayer.";
        exit;
    }

    // 3. Configuration de l'email
    $destinataire = "ton-email@exemple.com"; // REMPLACE PAR TON ADRESSE EMAIL
    $sujet = "Nouveau contact de $nom $prenom via IDS Tech";
    
    $contenu_email = "Nom: $nom\n";
    $contenu_email .= "Prénom: $prenom\n";
    $contenu_email .= "Email: $email\n\n";
    $contenu_email .= "Message:\n$message\n";

    $headers = "From: $nom <$email>";

    // 4. Envoi de l'email
    if (mail($destinataire, $sujet, $contenu_email, $headers)) {
        echo "Merci ! Votre message a été envoyé.";
    } else {
        echo "Oups ! Quelque chose a mal tourné et nous n'avons pas pu envoyer votre message.";
    }
} else {
    echo "Il y a eu un problème avec votre soumission, veuillez réessayer.";
}
?>