# Projet Ydays 2025 – Plateforme E-commerce Locale

## Sommaire
- [Projet Ydays 2025 – Plateforme E-commerce Locale](#projet-ydays-2025--plateforme-e-commerce-locale)
  - [Sommaire](#sommaire)
  - [1. Présentation du projet](#1-présentation-du-projet)
  - [2. Objectifs du projet](#2-objectifs-du-projet)
  - [3. Stack technique](#3-stack-technique)
    - [Explications des technologies](#explications-des-technologies)
  - [4. Architecture du projet](#4-architecture-du-projet)
  - [5. Lancement du projet](#5-lancement-du-projet)
  - [6. Illustration](#6-illustration)
  - [7. Évolutions possibles](#7-évolutions-possibles)

---

## 1. Présentation du projet

Le projet **Ydays 2025** a pour objectif de développer une **plateforme e-commerce locale** permettant aux commerçants et artisans d’une région de vendre leurs produits en ligne tout en favorisant le commerce de proximité.  
L’application doit être rapide, moderne, responsive et simple d’utilisation, pour les utilisateurs comme pour les administrateurs.

---

## 2. Objectifs du projet

* Créer une application web complète (front-end et back-end).  
* Permettre la consultation, l’ajout au panier et l’achat de produits locaux.  
* Mettre en avant la proximité géographique entre acheteurs et commerçants.  
* Fournir une interface ergonomique et fluide adaptée à tous les écrans.  
* Garantir la sécurité et la fiabilité des données des utilisateurs.  
* Mise en place du système du coursier (type Uber Eats).  
* Filtre géographique pour afficher les commerces proches.  

---

## 3. Stack technique

**Front-end :** React avec Tailwind CSS  
**Back-end :** Node.js (Express.js) avec Supabase pour la base de données et l’authentification  

| **Front-end**                                                                                                                                                                                                                                            | **Back-end**                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="40"/> **React**  <br> <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind" width="40"/> **Tailwind CSS** | <img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" width="45"/> **Node.js (Express.js)**  <br> <img src="https://logowik.com/content/uploads/images/supabase-icon1721342077.logowik.com.webp" alt="Supabase" width="40"/> **Supabase** |

---



### Explications des technologies

* **React :** Framework JavaScript moderne pour créer des interfaces utilisateurs dynamiques et modulaires, idéal pour les Single Page Applications (SPA).  
  Nous avons choisi React pour ce projet afin de relever un défi collectif : un membre du groupe a déjà des notions sur ce framework, tandis qu’un autre est débutant. Cela nous permet de renforcer nos compétences tout en utilisant une technologie de plus en plus répandue dans le développement web.

* **Tailwind CSS :** Framework CSS utilitaire qui simplifie le design et assure une cohérence visuelle rapide et facile à maintenir. Il permet de créer des interfaces modernes sans écrire de longues feuilles de style.

* **Node.js / Express.js :** Serveur JavaScript rapide et scalable, facile à connecter aux bases de données et aux API.  
  Node.js a été choisi par préférence du groupe (Frédéric et Jean), car nous avons déjà une expérience préalable avec ce framework et il s’intègre facilement avec React et Supabase.

* **Supabase :** Base de données PostgreSQL avec API et authentification intégrées, qui simplifie la gestion des utilisateurs et des données.  
  Cette solution moderne est efficace pour le back-end et l’authentification. Les membres du groupe l’ont déjà utilisée dans des projets précédents, ce qui assure une mise en œuvre rapide et sécurisée.


---

## 4. Architecture du projet 

Arborescence du projet 
Organisation des dossiers (peut changer suivant l'évolution du projet) :

```text
Projet-Ydays-2025/
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── controllers/
│   │   ├── productsController.js
│   │   └── shopsController.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── routes/
│   │   ├── index.js
│   │   ├── products.js
│   │   └── shops.js
│   ├── server.js
│   └── supabaseClient.js
├── frontend/
│   ├── postcss.config.js
│   ├── .env
│   ├── .gitignore
│   ├── diagramme_BDD.svg
│   ├── eslint.config.js
│   ├── home_de_depart
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   └── localstyle.png
│   ├── recap_site_localstyle.png
│   ├── shops/
│   │   ├── ShopCard.jsx
│   │   └── ShopList.jsx
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   └── logo_google.jpeg
│   │   ├── components/
│   │   │   ├── DeliveryToggle.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── merchant/
│   │   │   │   ├── MerchantHeader.jsx
│   │   │   │   ├── MerchantOrderCard.jsx
│   │   │   │   ├── MerchantProductCard.jsx
│   │   │   │   ├── MerchantSidebar.jsx
│   │   │   │   └── MerchantStatsCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── UserSidebar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AuthProvider.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── CartProvider.jsx
│   │   │   ├── DeliveryContext.jsx
│   │   │   ├── DeliveryProvider.jsx
│   │   │   └── merchant/
│   │   │       └── MerchantAuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── merchant/
│   │   │   │   ├── useMerchantAnalytics.jsx
│   │   │   │   ├── useMerchantOrders.jsx
│   │   │   │   └── useMerchantProducts.jsx
│   │   │   ├── useCart.jsx
│   │   │   ├── useShop.jsx
│   │   │   └── useShops.jsx
│   │   ├── index.css
│   │   ├── lib/
│   │   │   └── supabaseClient.js
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── CartPage.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── CompteUser.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── merchant/
│   │   │   │   ├── AnalyticsMerchant.jsx
│   │   │   │   ├── DashboardMerchant.jsx
│   │   │   │   ├── HeaderMerchant.jsx
│   │   │   │   ├── LoginMerchant.jsx
│   │   │   │   ├── ManageProducts.jsx
│   │   │   │   ├── ManageShop.jsx
│   │   │   │   ├── OrdersMerchant.jsx
│   │   │   │   ├── RegisterMerchant.jsx
│   │   │   │   └── SIdebarMerchant.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ShopDetail.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductList.jsx
│   │   ├── routes/
│   │   │   ├── AppRouter.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProtectedRouteMerchant.jsx
│   │   │   └── routesConfig.jsx
│   │   └── services/
│   │       ├── authService.jsx
│   │       ├── merchant/
│   │       │   └── merchantService.jsx
│   │       ├── productService.js
│   │       └── shopService.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── package-lock.json
└── README.md
```

---

## 5. Lancement du projet

**Côté Front-end :**

```bash
cd frontend
npm install
npm run dev
```

**Côté Back-end :**

```bash
cd backend
npm install
npm start
```

---

## 6. Illustration

*(Ajouter ici vos captures d’écran ou diagrammes du projet)*

Capture d'ecrans Interface Utilisateur :
![frontend_page_1](captures_ecran/frontend1.png)
![frontend_page_2](captures_ecran/frontend2.png)


---

## 7. Évolutions possibles
* Important - Mettre une Maps(avec l'API Google Maps) pour localiser les clients en fonction de leur emplacement (voir la stratégie)
Quand l'app grandira, je pourrais :
Ajouter latitude / longitude au moment de créer un shop
Calculer les distances
Débloquer plusieurs villes
Utiliser Google Maps intelligemment
------------
* Système de paiement sécurisé (Stripe).  
* Application mobile avec React Native.  

