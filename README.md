📦 Wikipack — Auto ouverture de paquets

Userscript pour automatiser l'ouverture des paquets sur WikiMasters.

Automatise l'ouverture des paquets, la révélation des cartes et le passage au paquet suivant, avec un HUD intégré pour suivre l'état du script.

✨ Fonctionnalités

📦 Ouverture automatique des paquets

🃏 Révélation automatique des cartes

⚡ Deux modes : Normal et Rapide

⏱️ Suivi du timer des paquets

🔔 Notifications navigateur et alerte sonore

🎛️ HUD avec contrôle et statistiques

💾 Sauvegarde automatique des paramètres

🌐 Compatible avec la navigation sur WikiMasters

🚀 Installation
1. Installer un gestionnaire de userscripts
	Chrome	Firefox
🐒 Tampermonkey	Installer ↗
	Installer ↗

🐵 Violentmonkey	Installer ↗
	Installer ↗
2. Installer Wikipack

Ouvrir Tampermonkey ou Violentmonkey.

Créer un nouveau userscript.

Copier le contenu de Wikipack.user.js.

Enregistrer.

Ouvrir WikiMasters
.

Le script se lance automatiquement.

🎮 Fonctionnement

Une fois activé, Wikipack effectue automatiquement le cycle suivant :

📦 Paquet disponible
       ↓
📦 Ouverture
       ↓
🃏 Révélation des cartes
       ↓
✅ Continuer
       ↓
🔄 Paquet suivant


Le script n'effectue l'ouverture automatique que sur la page Paquets.

🎛️ HUD

Le HUD permet de contrôler rapidement le script :

Fonction	Description
🟢 Auto-ouverture	Active ou désactive l'automatisation
⚡ Vitesse	Choix entre Normal et Rapide
📦 Paquets	Nombre de paquets disponibles
⏱️ Timer	Temps avant le prochain paquet
📊 Statistiques	Paquets ouverts et cartes parcourues

Le HUD est également déplaçable et mémorise sa position.

🔔 Notifications

Lorsqu'un nouveau paquet devient disponible, Wikipack peut :

🔊 jouer une alerte sonore ;

🔔 afficher une notification navigateur.

ℹ️ Le navigateur peut demander une autorisation pour les notifications et bloquer le son jusqu'à une première interaction avec la page.

⚡ Modes de vitesse
Mode	Ouverture	Carte	Continuer
🟢 Normal	800 ms	250 ms	600 ms
🔴 Rapide	300 ms	80 ms	200 ms
⚠️ Avertissement

Wikipack dépend de la structure actuelle du site WikiMasters.

Si WikiMasters modifie son interface, ses boutons ou son fonctionnement interne, certaines fonctionnalités peuvent nécessiter une mise à jour du script.

Utilisez le script conformément aux règles et conditions d'utilisation de WikiMasters.

📄 Informations

Nom : Wikipack — Auto ouverture de paquets
Version : 1.0.1
Type : Userscript
Plateformes : Chrome · Firefox
Gestionnaires : Tampermonkey · Violentmonkey

<p align="center"> Made with ❤️ for WikiMasters </p>
