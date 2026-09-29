# 📦 Wikipack — Auto-ouverture de paquets

> **Automatisez l'ouverture de vos paquets sur WikiMasters**

Wikipack est un **userscript** conçu pour automatiser l'ouverture des paquets sur **WikiMasters**

Il prend en charge automatiquement l'ouverture des paquets, la révélation des cartes ainsi que le passage au paquet suivant. Un **HUD intégré** permet également de suivre l'état du script et de contrôler l'automatisation en temps réel

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Plateformes](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox-orange)
![Userscript](https://img.shields.io/badge/type-Userscript-green)

---

## ✨ Fonctionnalités

* **Ouverture automatique** des paquets
* Deux modes de vitesse : **Normal** et **Rapide**
* **HUD intégré** pour suivre l'état de l'automatisation
* **Notifications navigateur** lorsqu'un paquet devient disponible
* **Alerte sonore** lorsqu'un nouveau paquet est disponible

---

## 🛠️ Installation

Wikipack fonctionne avec les gestionnaires de userscripts **Tampermonkey** ou **Violentmonkey**

| Gestionnaire         | Chrome                                                                                               | Firefox                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| *Tampermonkey*  | —                                                                                                    | [Installer](https://addons.mozilla.org/firefox/addon/tampermonkey/)  |
| *Violentmonkey* | [Installer](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) | [Installer](https://addons.mozilla.org/firefox/addon/violentmonkey/) |

Une fois votre gestionnaire installé, ajoutez simplement le script Wikipack

---

## ⚡ Modes de vitesse

Wikipack propose deux modes d'automatisation afin de s'adapter à la réactivité de WikiMasters

| Mode          | 📦 Ouverture | 🃏 Révélation | ✅ Continuer |
| ------------- | -----------: | ------------: | ----------: |
| 🟢 **Normal** |       800 ms |        250 ms |      600 ms |
| 🔴 **Rapide** |       300 ms |         80 ms |      200 ms |

### 🟢 Normal

Le mode **Normal** utilise des délais plus importants entre chaque action afin de laisser davantage de temps à l'interface pour réagir

Il est recommandé lorsque WikiMasters répond lentement ou lorsque vous rencontrez des problèmes avec le mode Rapide

### 🔴 Rapide

Le mode **Rapide** réduit les délais entre les différentes actions afin de traiter les paquets plus rapidement

> ⚠️ Ce mode dépend davantage de la réactivité de WikiMasters. Si l'interface réagit lentement ou si certaines actions ne sont pas correctement détectées, privilégiez le mode **Normal**

---

## 🔔 Notifications

Wikipack peut vous avertir lorsqu'un nouveau paquet devient disponible

Deux types de notifications sont disponibles :

* **Alerte sonore**
* **Notification navigateur**

### 🔐 Autorisations

Les notifications navigateur nécessitent l'autorisation du navigateur

La lecture automatique du son peut également être bloquée par certains navigateurs jusqu'à ce qu'une première interaction avec la page ait été effectuée

---

## 🌐 Compatibilité

| Environnement        | Support      |
| -------------------- | ------------ |
| **Firefox**, *Tampermonkey* | ✅ Testé |
| **Firefox**, *Violentmonkey*| ✅ Testé |
| **Chrome**, *Violentmonkey* | ✅ Testé |
| **Mobile**        | ⚠️ Non testé |

> La compatibilité peut également dépendre de la version actuelle de WikiMasters et des éventuelles modifications apportées à son interface

---

## ⚠️ Avertissement

Wikipack dépend de la structure et du fonctionnement actuels de **WikiMasters**

Si WikiMasters modifie son interface, ses boutons, ses classes CSS ou son fonctionnement interne, certaines fonctionnalités de Wikipack peuvent cesser de fonctionner et nécessiter une mise à jour du script

> 📌 **Wikipack n'est pas officiellement affilié à WikiMasters**

Utilisez le script conformément aux **règles et conditions d'utilisation de WikiMasters**

---

<p align="center">
  Made with ❤️ for WikiMasters
</p>
