📦 Wikipack

Userscript d'automatisation des paquets pour WikiMasters
.








✨ Fonctionnalités

📦 Ouverture automatique des paquets

🃏 Révélation automatique des cartes

⚡ Modes Normal et Rapide

⏱️ Suivi du timer des paquets

🔔 Notifications navigateur + alerte sonore

🎛️ HUD avec statistiques et contrôles

💾 Sauvegarde automatique des paramètres

🚀 Installation
1. Installer un gestionnaire de Userscripts
Gestionnaire	🌐 Chrome
	🦊 Firefox

🐒 Tampermonkey	⬇️ Installer
	⬇️ Installer

🐵 Violentmonkey	⬇️ Installer
	⬇️ Installer
2. Installer Wikipack

Une fois Tampermonkey ou Violentmonkey installé :

Téléchargez Wikipack.user.js.

Ouvrez votre gestionnaire de Userscripts.

Créez un nouveau script.

Collez le contenu de Wikipack.user.js.

Enregistrez.

Rendez-vous sur WikiMasters
.

💡 Si votre navigateur vous le permet, vous pouvez également ouvrir directement le fichier .user.js pour proposer son installation.

🎮 Utilisation

Une fois installé, Wikipack fonctionne automatiquement sur :

https://wiki-masters.com/*


Le cycle automatique est :

📦 Paquet disponible
        ↓
📦 Ouverture
        ↓
🃏 Révélation des cartes
        ↓
✅ Continuer
        ↓
🔄 Recommencer

🎛️ HUD

Le HUD intégré permet de contrôler et surveiller le script :

Fonction	Description
🟢 Auto-ouverture	Active / désactive l'automatisation
⚡ Vitesse	Normal ou Rapide
📦 Paquets	Nombre de paquets disponibles
⏱️ Timer	Temps avant le prochain paquet
📊 Statistiques	Paquets ouverts et cartes parcourues

Le HUD peut être déplacé et sa position est sauvegardée automatiquement.

⚡ Vitesses
Mode	Ouverture	Carte suivante	Continuer
🟢 Normal	800 ms	250 ms	600 ms
🔴 Rapide	300 ms	80 ms	200 ms
🔔 Notifications

Lorsqu'un paquet devient disponible, Wikipack peut envoyer :

🔊 une alerte sonore ;

🔔 une notification navigateur.

⚠️ Le navigateur peut demander l'autorisation d'afficher des notifications. Le son peut également nécessiter une première interaction avec la page.

📁 Structure
Wikipack/
├── Wikipack.user.js
└── README.md

⚠️ Avertissement

Wikipack dépend de la structure actuelle de WikiMasters.

Une modification de l'interface du site peut entraîner des dysfonctionnements et nécessiter une mise à jour du script.

Utilisez Wikipack conformément aux règles et conditions d'utilisation de WikiMasters.

📄 Informations
	
Nom	Wikipack
Version	1.0.1
Type	Userscript
Navigateurs	Chrome · Firefox
Gestionnaires	Tampermonkey · Violentmonkey
Site	wiki-masters.com
<p align="center">

Wikipack · Automatiser les paquets, simplement. 📦

</p>
