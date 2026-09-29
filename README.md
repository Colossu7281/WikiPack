# 📦 Wikipack — Auto ouverture de paquets

> **Automatisez l'ouverture de vos paquets sur WikiMasters.**

Wikipack est un **userscript** conçu pour automatiser l'ouverture des paquets sur **WikiMasters**.

Il gère automatiquement l'ouverture des paquets, la révélation des cartes et le passage au paquet suivant, tout en proposant un **HUD intégré** permettant de suivre et contrôler l'automatisation en temps réel.

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Plateformes](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox-orange)
![Userscript](https://img.shields.io/badge/type-Userscript-green)

---

## ✨ Fonctionnalités

* 🃏 **Ouverture automatique** des paquets
* ⚡ Deux modes de vitesse : **Normal** et **Rapide**
* 🔔 **Notifications navigateur**
* 🔊 **Alerte sonore** lorsqu'un paquet devient disponible

---


Wikipack fonctionne avec **Tampermonkey** et **Violentmonkey**.

| Gestionnaire         | Chrome                                                                                                                      | Firefox                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 🐒 **Tampermonkey**  | - | [Installer](https://addons.mozilla.org/firefox/addon/tampermonkey/?utm_source=chatgpt.com)  |
| 🐵 **Violentmonkey** | [Installer](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?utm_source=chatgpt.com) | [Installer](https://addons.mozilla.org/firefox/addon/violentmonkey/?utm_source=chatgpt.com) |

---

## 🎮 Fonctionnement

Une fois activé, Wikipack automatise le cycle suivant :

```text
📦 Paquet disponible
       │
       ▼
📦 Ouverture du paquet
       │
       ▼
🃏 Révélation des cartes
       │
       ▼
✅ Passage à la suite
       │
       ▼
🔄 Paquet suivant
       │
       └───────────────►
```

L'automatisation de l'ouverture est active **uniquement sur la page Paquets**, afin d'éviter toute interaction indésirable sur les autres pages de WikiMasters.

---

## 🎛️ HUD

Wikipack dispose d'un **HUD compact et déplaçable** permettant de contrôler le script directement depuis WikiMasters.

| Fonction              | Description                                          |
| --------------------- | ---------------------------------------------------- |
| 🟢 **Auto-ouverture** | Active ou désactive l'automatisation                 |
| ⚡ **Vitesse**         | Sélectionne le mode Normal ou Rapide                 |
| 📦 **Paquets**        | Affiche le nombre de paquets disponibles             |
| ⏱️ **Timer**          | Affiche le temps restant avant le prochain paquet    |
| 📊 **Statistiques**   | Affiche les paquets ouverts et les cartes parcourues |

### 🖱️ HUD déplaçable

Le HUD peut être déplacé librement sur la page.

Sa position est automatiquement sauvegardée afin de conserver votre emplacement préféré lors de vos prochaines visites.

---

## ⚡ Modes de vitesse

Wikipack propose deux modes d'automatisation.

| Mode          | 📦 Ouverture | 🃏 Carte | ✅ Continuer |
| ------------- | -----------: | -------: | ----------: |
| 🟢 **Normal** |       800 ms |   250 ms |      600 ms |
| 🔴 **Rapide** |       300 ms |    80 ms |      200 ms |

### 🟢 Normal

Le mode Normal utilise des délais plus importants afin de laisser davantage de temps à l'interface pour effectuer chaque action.

### 🔴 Rapide

Le mode Rapide réduit les délais entre les actions pour permettre un traitement plus rapide des paquets.

> ⚠️ Le mode Rapide dépend davantage de la réactivité de WikiMasters. Si l'interface évolue ou réagit lentement, le mode Normal peut être préférable.

---

## 🔔 Notifications

Wikipack peut vous avertir lorsqu'un nouveau paquet devient disponible.

Deux types de notifications sont disponibles :

* 🔊 **Alerte sonore**
* 🔔 **Notification navigateur**

### 🔐 Autorisations

Le navigateur peut demander une autorisation pour afficher les notifications.

De même, certains navigateurs peuvent bloquer la lecture automatique du son jusqu'à ce qu'une première interaction ait eu lieu avec la page.

---

## 💾 Paramètres

Les paramètres de Wikipack sont automatiquement sauvegardés dans le navigateur.

Cela permet notamment de conserver :

* ⚙️ l'état de l'auto-ouverture ;
* ⚡ le mode de vitesse sélectionné ;
* 🖱️ la position du HUD ;
* 📊 les statistiques du script.

---

## 🌐 Compatibilité

| Environnement    | Support      |
| ---------------- | ------------ |
| 🦊 Firefox       | ✅            |
| 🌐 Chrome        | ✅            |
| 🐒 Tampermonkey  | ✅            |
| 🐵 Violentmonkey | ✅            |
| 📱 Mobile        | ⚠️ Non testé |

> La compatibilité dépend également de la version actuelle de WikiMasters et de son interface.

---

## ⚠️ Avertissement

Wikipack dépend de la structure et du fonctionnement actuels de **WikiMasters**.

Si WikiMasters modifie son interface, ses boutons, ses classes CSS ou son fonctionnement interne, certaines fonctionnalités de Wikipack peuvent cesser de fonctionner et nécessiter une mise à jour.

> 📌 **Wikipack n'est pas affilié officiellement à WikiMasters**, sauf indication contraire.

Utilisez le script conformément aux **règles et conditions d'utilisation de WikiMasters**.

---

## 🤝 Contribution

Les contributions, suggestions et corrections sont les bienvenues !

Si vous souhaitez améliorer Wikipack :

1. 🍴 Forkez le dépôt.
2. 🌿 Créez une nouvelle branche.
3. ✏️ Effectuez vos modifications.
4. 🧪 Testez le script sur WikiMasters.
5. 📤 Ouvrez une Pull Request.

---

## ❤️ Crédits

<p align="center">
  Made with ❤️ for WikiMasters
</p>
