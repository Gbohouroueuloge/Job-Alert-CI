

const Home = () => {
  return (
    <body class="bg-surface-container-lowest text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      {/* <!-- TopNavBar --> */}
      <nav class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div class="flex justify-between items-center px-4 md:px-margin-desktop max-w-max-width mx-auto h-xl">
          <div class="flex items-center gap-xs">
            <div class="h-8 md:h-10 w-auto">
              <img alt="JobAlert CI Logo" class="h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhg7S3dRQSIDmCdN3V8mFfJFVPr935SwckgLKeERmitkpw16bL7GKSVBMN6mmyN0koKpT1u5CSW-cCUhvKmwdQ6r9EPi5ImNi3ifNi6mUZV5GTfs_y2VRoK-gvv2uTelfs4ZHpJQu-BrnKJfsuQ1qGPz0uZvLt2NX7SASu2OtmZ-hf4U4LTAdciF2mo7GXbkCqnEgMG0M1Mxw0MlZJf2VQ_6BcnT1BFXDtOWlhwDR43ZUL_VVHpEvIxwOCCTKjiV3tdnuhzFffsm4V" />
            </div>
            <span
              class="font-headline-sm text-headline-sm md:font-headline-md md:text-headline-md font-bold text-brand-navy hidden sm:block">JobAlert
              CI</span>
          </div>
          <div class="hidden md:flex gap-md items-center">
            <a class="text-brand-navy font-label-md text-label-md transition-all border-b-2 border-brand-orange pb-1"
              href="#">Accueil</a>
            <a class="text-on-surface-variant hover:text-brand-orange font-label-md text-label-md transition-all"
              href="#">Comment ça marche</a>
            <a class="text-on-surface-variant hover:text-brand-orange font-label-md text-label-md transition-all"
              href="#">Offres</a>
          </div>
          <div class="flex items-center gap-sm">
            <a class="hidden md:block text-brand-navy font-label-md text-label-md hover:text-brand-orange transition-colors"
              href="#">Connexion</a>
            <a class="bg-brand-orange text-white font-label-md text-label-md px-sm py-2 rounded-DEFAULT hover:brightness-110 transition-all shadow-sm whitespace-nowrap"
              href="#">Publier une offre</a>
          </div>
        </div>
      </nav>
      
      <main class="flex-grow">
        {/* <!-- Hero Section --> */}
        <section class="relative pt-xl pb-xl md:pt-[120px] md:pb-[100px] overflow-hidden hero-gradient">
          <div class="absolute inset-0 bg-pattern opacity-50"></div>
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
              <div class="flex flex-col gap-sm md:gap-md text-center md:text-left">
                <h1
                  class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-brand-navy">
                  Trouvez votre prochain emploi sans chercher.
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant max-w-[500px] mx-auto md:mx-0">
                  Recevez chaque matin par email les meilleures offres d'emploi en Côte d'Ivoire, triées selon
                  votre métier.
                </p>
                <div class="mt-md mb-md w-full max-w-[600px] mx-auto md:mx-0">
                  <div
                    class="bg-white p-2 rounded-lg shadow-soft border border-surface-variant flex flex-col md:flex-row gap-2">
                    <div
                      class="flex-grow flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-outline-variant/30">
                      <span
                        class="material-symbols-outlined text-on-surface-variant opacity-60">search</span><input
                        class="w-full py-2 bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-on-surface-variant/50"
                        placeholder="Métier, mots-clés..." type="text" /></div>
                    <div class="flex-grow flex items-center px-3 gap-2"><span
                      class="material-symbols-outlined text-on-surface-variant opacity-60">location_on</span><input
                        class="w-full py-2 bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-on-surface-variant/50"
                        placeholder="Ville ou région" type="text" /></div><button
                          class="bg-brand-orange text-white p-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center"><span
                            class="material-symbols-outlined">search</span></button>
                  </div>
                </div>
                <div class="mt-xs">
                  <button
                    class="bg-brand-orange text-white font-label-md text-label-md px-lg py-3 rounded-DEFAULT shadow-soft hover:shadow-hover transition-all inline-flex items-center justify-center gap-2">
                    S'inscrire gratuitement
                    <span class="material-symbols-outlined"
                      >arrow_forward</span>
                  </button>
                </div>
              </div>
              <div class="hidden md:block relative h-[400px]">
                <div class="w-full h-full bg-cover bg-center rounded-xl shadow-hover absolute top-0 right-0 z-10 border border-outline-variant/20"
                  data-alt="A modern, abstract 3D composition representing career growth and navigation, featuring a stylized compass pointing forward, rising energetic geometric shapes, and subtle email notification icons. The color palette uses deep professional navy blue (#0F2D4D) and vibrant dynamic orange (#F5A623) on a clean, bright white background. Soft, high-key lighting creates a professional, optimistic, and forward-looking corporate tech aesthetic."
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2R8eXDd5IKERXI2bigQM5k2d5rFSptvjLAmlZ1u-VEy1gB3k05JIzwZv3jLfGsvaOXj2WJlL7YfR8_kyUpMhMravBsbUWKoQCJK-RDZ28JJu8UKx_AlBcxQ6Sqz-HqQALkOneotjQiKmICKX5g0jMTTaHYXmVneuME9-rK0SiU953XhsZdlaYPXZat4puNtNcRR2KYA41y_KHvz80yZMRg8z6uqg5iLJnP-v8UOoHBDI4ryB4FWGfeOENloA9lCBW-NK7Gw-yaN3L')"}}>
                </div>
                {/* <!-- Decorative element --> */}
                <div class="absolute -bottom-md -left-md w-3/4 h-3/4 bg-brand-navy/5 rounded-xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Stats Bar --> */}
        <section class="bg-brand-navy text-white py-lg border-y border-brand-navy/10">
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-md text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
              <div class="flex flex-col items-center gap-2 py-4 md:py-0">
                <span class="material-symbols-outlined text-brand-orange text-[32px]">work</span>
                <h3 class="font-headline-md text-headline-md font-bold">5 000+</h3>
                <p class="font-body-sm text-body-sm text-white/80">Offres centralisées</p>
              </div>
              <div class="flex flex-col items-center gap-2 py-4 md:py-0">
                <span class="material-symbols-outlined text-brand-orange text-[32px]">language</span>
                <h3 class="font-headline-md text-headline-md font-bold">15</h3>
                <p class="font-body-sm text-body-sm text-white/80">Sites spécialisés couverts</p>
              </div>
              <div class="flex flex-col items-center gap-2 py-4 md:py-0">
                <span class="material-symbols-outlined text-brand-orange text-[32px]">check_circle</span>
                <h3 class="font-headline-md text-headline-md font-bold">100%</h3>
                <p class="font-body-sm text-body-sm text-white/80">Gratuit pour les candidats</p>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- How it Works --> */}
        <section class="py-xl md:py-[100px] bg-surface-container-lowest">
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center mb-xl">
              <h2 class="font-headline-md text-headline-md text-brand-navy mb-xs">Comment ça marche ?</h2>
              <p class="font-body-md text-body-md text-on-surface-variant">Un processus simple pour booster votre
                recherche d'emploi.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {/* <!-- Step 1 --> */}
              <div
                class="bg-white p-lg rounded-xl shadow-soft border border-surface-variant text-center flex flex-col items-center gap-sm relative">
                <div
                  class="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center text-brand-navy absolute -top-6 border-4 border-white">
                  <span class="font-headline-sm text-headline-sm">1</span>
                </div>
                <span class="material-symbols-outlined text-brand-navy text-[48px] mt-2">search</span>
                <h3 class="font-headline-sm text-headline-sm text-brand-navy">Collecte</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Nous scannons le web pour vous.</p>
              </div>
              {/* <!-- Step 2 --> */}
              <div
                class="bg-white p-lg rounded-xl shadow-soft border border-surface-variant text-center flex flex-col items-center gap-sm relative">
                <div
                  class="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center text-brand-navy absolute -top-6 border-4 border-white">
                  <span class="font-headline-sm text-headline-sm">2</span>
                </div>
                <span class="material-symbols-outlined text-brand-navy text-[48px] mt-2">filter_alt</span>
                <h3 class="font-headline-sm text-headline-sm text-brand-navy">Tri intelligent</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">On sélectionne les offres qui vous
                  correspondent.</p>
              </div>
              {/* <!-- Step 3 --> */}
              <div
                class="bg-white p-lg rounded-xl shadow-soft border border-surface-variant text-center flex flex-col items-center gap-sm relative">
                <div
                  class="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center text-brand-navy absolute -top-6 border-4 border-white">
                  <span class="font-headline-sm text-headline-sm">3</span>
                </div>
                <span class="material-symbols-outlined text-brand-navy text-[48px] mt-2">mail</span>
                <h3 class="font-headline-sm text-headline-sm text-brand-navy">Envoi quotidien</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Directement dans votre boîte mail à
                  8h.</p>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Recent Offers (Bento/Card Grid) --> */}
        <section class="py-xl bg-background border-y border-outline-variant/30">
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="flex justify-between items-end mb-lg">
              <div>
                <h2 class="font-headline-md text-headline-md text-brand-navy mb-xs">Offres Récentes</h2>
                <p class="font-body-md text-body-md text-on-surface-variant">Aperçu des opportunités du jour.
                </p>
              </div>
              <a class="hidden md:flex items-center gap-1 text-brand-navy font-label-md text-label-md hover:underline"
                href="#">
                Voir toutes les offres <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {/* <!-- Card 1 --> */}
              <div
                class="bg-white rounded-xl p-lg shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all border border-surface-variant flex flex-col h-full cursor-pointer group">
                <div class="flex justify-between items-start mb-md">
                  <div
                    class="w-12 h-12 bg-brand-navy/5 rounded-lg flex items-center justify-center text-brand-navy font-bold border border-brand-navy/10">
                    CO
                  </div>
                  <span
                    class="bg-brand-orange text-white font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm">Nouveau</span>
                </div>
                <h3
                  class="font-headline-sm text-headline-sm text-brand-navy group-hover:text-brand-orange transition-colors mb-1">
                  Comptable</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mb-lg">Entreprise Confidentielle</p>
                <div class="mt-auto flex flex-col gap-3">
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[18px] text-brand-orange">location_on</span>
                    <span class="font-body-sm text-body-sm">Abidjan</span>
                  </div>
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[18px] text-brand-orange">schedule</span>
                    <span class="font-body-sm text-body-sm">Temps plein</span>
                  </div>
                  <div class="pt-md border-t border-outline-variant/20 mt-xs">
                    <span
                      class="bg-brand-navy/5 text-brand-navy font-label-sm text-label-sm px-3 py-1.5 rounded-lg border border-brand-navy/10">Finance</span>
                  </div>
                </div>
              </div>
              {/* <!-- Card 2 --> */}
              <div
                class="bg-white rounded-xl p-lg shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all border border-surface-variant flex flex-col h-full cursor-pointer group">
                <div class="flex justify-between items-start mb-md">
                  <div
                    class="w-12 h-12 bg-brand-navy/5 rounded-lg flex items-center justify-center text-brand-navy font-bold border border-brand-navy/10">
                    DF
                  </div>
                  <span
                    class="bg-brand-orange text-white font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm">Nouveau</span>
                </div>
                <h3
                  class="font-headline-sm text-headline-sm text-brand-navy group-hover:text-brand-orange transition-colors mb-1">
                  Développeur Fullstack</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mb-lg">Tech Solutions CI</p>
                <div class="mt-auto flex flex-col gap-3">
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[18px] text-brand-orange">location_on</span>
                    <span class="font-body-sm text-body-sm">Plateau</span>
                  </div>
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span
                      class="material-symbols-outlined text-[18px] text-brand-orange">work_outline</span>
                    <span class="font-body-sm text-body-sm">CDI</span>
                  </div>
                  <div class="pt-md border-t border-outline-variant/20 mt-xs">
                    <span
                      class="bg-brand-navy/5 text-brand-navy font-label-sm text-label-sm px-3 py-1.5 rounded-lg border border-brand-navy/10">IT</span>
                  </div>
                </div>
              </div>
              {/* <!-- Card 3 --> */}
              <div
                class="bg-white rounded-xl p-lg shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all border border-surface-variant flex flex-col h-full cursor-pointer group">
                <div class="flex justify-between items-start mb-md">
                  <div
                    class="w-12 h-12 bg-brand-navy/5 rounded-lg flex items-center justify-center text-brand-navy font-bold border border-brand-navy/10">
                    CT
                  </div>
                </div>
                <h3
                  class="font-headline-sm text-headline-sm text-brand-navy group-hover:text-brand-orange transition-colors mb-1">
                  Commercial Terrain</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mb-lg">Agro Distribution</p>
                <div class="mt-auto flex flex-col gap-3">
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[18px] text-brand-orange">location_on</span>
                    <span class="font-body-sm text-body-sm">San Pédro</span>
                  </div>
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[18px] text-brand-orange">schedule</span>
                    <span class="font-body-sm text-body-sm">Mission</span>
                  </div>
                  <div class="pt-md border-t border-outline-variant/20 mt-xs">
                    <span
                      class="bg-brand-navy/5 text-brand-navy font-label-sm text-label-sm px-3 py-1.5 rounded-lg border border-brand-navy/10">Vente</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-md text-center md:hidden">
              <a class="inline-flex items-center gap-1 text-brand-navy font-label-md text-label-md hover:underline"
                href="#">
                Voir toutes les offres <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>
        {/* <!-- Reassurance / Final CTA Section --> */}
        {/* <!-- FAQ Section --> */}
        <section class="py-xl bg-surface-container-lowest">
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center mb-lg">
              <h2 class="font-headline-md text-headline-md text-brand-navy mb-xs">Questions fréquentes</h2>
              <p class="font-body-md text-body-md text-on-surface-variant">Tout ce que vous devez savoir sur
                JobAlert CI.</p>
            </div>
            <div class="max-w-[800px] mx-auto flex flex-col gap-sm">
              <div class="bg-surface-container-low p-sm rounded-lg">
                <h3 class="font-label-md text-label-md text-brand-navy mb-1">Est-ce vraiment gratuit ?</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Oui, le service est 100% gratuit
                  pour tous les candidats. Nous ne vous demanderons jamais de frais d'inscription.</p>
              </div>
              <div class="bg-surface-container-low p-sm rounded-lg">
                <h3 class="font-label-md text-label-md text-brand-navy mb-1">Comment puis-je modifier mes
                  préférences ?</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Chaque email que vous recevez
                  contient un lien en bas de page pour mettre à jour votre métier ou vous désabonner en un
                  clic.</p>
              </div>
              <div class="bg-surface-container-low p-sm rounded-lg">
                <h3 class="font-label-md text-label-md text-brand-navy mb-1">Quelles sont les sources des offres
                  ?</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Nous agrégeons les offres provenant
                  de plus de 15 sites spécialisés, réseaux sociaux professionnels et sites d'entreprises en
                  Côte d'Ivoire.</p>
              </div>
              <div class="bg-surface-container-low p-sm rounded-lg">
                <h3 class="font-label-md text-label-md text-brand-navy mb-1">Quels secteurs d'activité sont
                  couverts ?</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Nous couvrons tous les domaines
                  clés en Côte d'Ivoire : Finance, Informatique, BTP, Marketing, Transit, Agriculture, etc.
                </p>
              </div>
              <div class="bg-surface-container-low p-sm rounded-lg">
                <h3 class="font-label-md text-label-md text-brand-navy mb-1">Puis-je recevoir les alertes sur
                  WhatsApp ?</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">C'est une fonctionnalité en cours
                  de déploiement ! Pour l'instant, nous nous concentrons sur l'email pour garantir que vous ne
                  manquiez aucune opportunité.</p>
              </div>
              <div class="bg-surface-container-low p-sm rounded-lg">
                <h3 class="font-label-md text-label-md text-brand-navy mb-1">Mes données sont-elles sécurisées ?
                </h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Absolument. Vos informations ne
                  sont utilisées que pour vous envoyer les offres d'emploi et ne sont jamais partagées avec
                  des tiers sans votre accord.</p>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Testimonials Section --> */}
        <section class="py-xl bg-background border-t border-outline-variant/30">
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center mb-lg">
              <h2 class="font-headline-md text-headline-md text-brand-navy mb-xs">Ils ont trouvé leur bonheur avec
                JobAlert CI</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
              {/* <!-- Testimonial 1 --> */}
              <div
                class="bg-white p-lg rounded-xl shadow-soft border border-surface-variant flex flex-col gap-md relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-[64px] text-brand-navy">format_quote</span>
                </div>
                <div class="flex items-center gap-sm relative z-10">
                  <div
                    class="w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold border-4 border-brand-navy/10">
                    MK
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <p class="font-label-md text-label-md text-brand-navy">Moussa K.</p>
                      <span class="material-symbols-outlined text-[16px] text-brand-orange"
                        >verified</span>
                    </div>
                    <p class="font-label-sm text-label-sm text-on-surface-variant">Abidjan</p>
                  </div>
                </div>
                <p class="font-body-md text-body-md text-on-surface italic leading-relaxed relative z-10">
                  "Grâce à JobAlert, j'ai reçu une offre d'Expert-Comptable qui me correspondait parfaitement
                  dès la première semaine."
                </p>
                <div class="flex gap-1 text-brand-orange">
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                </div>
              </div>
              {/* <!-- Testimonial 2 --> */}
              <div
                class="bg-white p-lg rounded-xl shadow-soft border border-surface-variant flex flex-col gap-md relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-[64px] text-brand-navy">format_quote</span>
                </div>
                <div class="flex items-center gap-sm relative z-10">
                  <div
                    class="w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold border-4 border-brand-navy/10">
                    AD
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <p class="font-label-md text-label-md text-brand-navy">Awa D.</p>
                      <span class="material-symbols-outlined text-[16px] text-brand-orange"
                        >verified</span>
                    </div>
                    <p class="font-label-sm text-label-sm text-on-surface-variant">Bouaké</p>
                  </div>
                </div>
                <p class="font-body-md text-body-md text-on-surface italic leading-relaxed relative z-10">
                  "Le gain de temps est incroyable. Plus besoin de parcourir 10 sites chaque matin, tout
                  arrive dans ma boîte mail."
                </p>
                <div class="flex gap-1 text-brand-orange">
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                </div>
              </div>
              {/* <!-- Testimonial 3 --> */}
              <div
                class="bg-white p-lg rounded-xl shadow-soft border border-surface-variant flex flex-col gap-md relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-[64px] text-brand-navy">format_quote</span>
                </div>
                <div class="flex items-center gap-sm relative z-10">
                  <div
                    class="w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold border-4 border-brand-navy/10">
                    JK
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <p class="font-label-md text-label-md text-brand-navy">Jean-Paul K.</p>
                      <span class="material-symbols-outlined text-[16px] text-brand-orange"
                        >verified</span>
                    </div>
                    <p class="font-label-sm text-label-sm text-on-surface-variant">San Pédro</p>
                  </div>
                </div>
                <p class="font-body-md text-body-md text-on-surface italic leading-relaxed relative z-10">
                  "J'ai trouvé mon CDI de développeur grâce à une alerte reçue à 8h pile. Je recommande
                  vivement !"
                </p>
                <div class="flex gap-1 text-brand-orange">
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                  <span class="material-symbols-outlined text-[18px]"
                    >star</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="py-xl bg-surface-container-low border-t border-outline-variant/20">
          <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div class="text-center mb-lg">
              <h2
                class="font-headline-sm text-headline-sm text-on-surface-variant opacity-60 uppercase tracking-widest">
                Ils nous font confiance</h2>
            </div>
            <div class="flex flex-wrap justify-center items-center gap-xl opacity-50 grayscale">
              <div class="h-8 md:h-12 flex items-center justify-center">
                <img alt="Orange CI" class="h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZG8dqbIX1PIc38Xv4ZCgvcYhwpHu8RRFb1cwLQJnubR8YkpyV_LBDQ76mGzF-VQrZ0LzKR2fwfPDoE71ceNf8Bv4D9WxXK-Dca9MoxAbthViWS0dcknIKzgQf60t2a39e9KKx00CgyZuNGldCMgY15XZNu3PZOdx6o-rd-SUAPh_Fe1MMtns0VFhCdbSSxye64NFH0K5lkIoju5lKwmwErNUL_grqmsLuv16o8gor2las52dsCtdlapa6ZJCY0oz3s_D4y6KJpfsH" />
              </div>
              <div class="h-8 md:h-12 flex items-center justify-center">
                <img alt="CIE" class="h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlc2_89bO0JA5CUrKOmKp57Q6s8bTPrWuDF__dPzoUW9TekRa2s5cfhxNBNGvfBZBSjsGIZkTVF5mU5GK7DjFbxHTMsP7VMOn4Z3CzvEJPnjYMFU6AVCk1EV-W8cPpi9WTPexhi639nAbpNPtq5QEV9wphweziL7fvjQL3Qm3tpjBw_zdVWUJTnFYGQDe9uWIMNb-VkYhpDEYdCwZ5EJHd_AnO17b6il2cOY_MuF79DOohKobuWC_Nu-YTfij6a8Dnq9UGv-Ne1Uv0" />
              </div>
              <div class="h-8 md:h-12 flex items-center justify-center">
                <img alt="SODECI" class="h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpAJR5BmCR5V5Q6JOR3OrpLhlQNaF4AeINrDV2J5zyaAgLm5xvc2EdjCQk5bAhnetxcSXjFIjd8NtzM8RLONtk6zetacX0-W0IuQQuJ4NXk6prC56qlReHuXgkjFIY43TxoTFKZA8eQ9DJiyV3xU-eN6Z78RBiuMJ1pDxrej5Zfe3FAjabAJz4u6jHlWquvtvPGxf0stdTanJvpNxQykIpzEaToz624_L0EHKPBTUfVbARElClDMupVGt4cuxc2JkjgPATy8egc5ld" />
              </div>
              <div class="h-8 md:h-12 flex items-center justify-center">
                <img alt="Emploi.ci" class="h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa7ItHRbtTAHsPldFw7JpZoQ5aBg9DIIX58-DHTUk2Ibp3Inv7ocaIdlYnFGxo8YWhvjTI81sfXHpB_lFKRNkgkMcNbYiLT4djXxQX3Rh6hYsye3EOJ5w6uAvpoQQlduiHCURTIy5YyoY8_a29FkbgcXGlZgK0y8gQrz6XAZGbHUkyeHuMSMxArbXJSiH6qssc1KqzxvIe4Y3psbWPOqmdeLRD9jc93Bef9KZZu4gT8TwQWGlEAL8c2NMqRPYXKp6I6xBnRGDaTJoq" />
              </div>
            </div>
          </div>
        </section>
        <section class="py-xl md:py-[100px] relative overflow-hidden bg-brand-navy text-white">
          <div class="absolute inset-0 bg-pattern opacity-10"></div>
          <div class="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
            <span class="material-symbols-outlined text-brand-orange text-[64px] mb-sm opacity-80"
              >explore</span>
            <h2
              class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-md">
              Votre boussole vers l'emploi.
            </h2>
            <p class="font-body-lg text-body-lg text-white/80 mb-lg max-w-[600px] mx-auto">
              Pas besoin de compte pour consulter les offres. Explorez des filières variées (Finance, IT, BTP,
              Marketing...) et trouvez l'opportunité qui vous correspond.
            </p>
            <div class="bg-white/10 p-lg rounded-xl border border-white/20 backdrop-blur-sm">
              <h3 class="font-headline-md text-headline-md mb-xs">Prêt à propulser votre carrière ?</h3>
              <p class="font-body-md text-body-md text-white/80 mb-md">Rejoignez plus de 50 000 Ivoiriens qui
                reçoivent déjà leurs offres personnalisées chaque matin.</p>
              <button
                class="bg-brand-orange text-white font-label-md text-label-md px-lg py-3 rounded-DEFAULT shadow-soft hover:shadow-hover hover:opacity-90 transition-all md:px-xl py-4 text-body-lg hover:scale-105 hover:brightness-110">
                Rejoindre JobAlert CI
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* <!-- Footer --> */}
      <footer class="bg-brand-navy text-white pt-xl pb-lg">
        <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-xl">
            <div class="flex flex-col gap-md">
              <div class="flex items-center gap-xs">
                <div class="h-8 bg-white rounded p-1">
                  <img alt="JobAlert CI Logo" class="h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhg7S3dRQSIDmCdN3V8mFfJFVPr935SwckgLKeERmitkpw16bL7GKSVBMN6mmyN0koKpT1u5CSW-cCUhvKmwdQ6r9EPi5ImNi3ifNi6mUZV5GTfs_y2VRoK-gvv2uTelfs4ZHpJQu-BrnKJfsuQ1qGPz0uZvLt2NX7SASu2OtmZ-hf4U4LTAdciF2mo7GXbkCqnEgMG0M1Mxw0MlZJf2VQ_6BcnT1BFXDtOWlhwDR43ZUL_VVHpEvIxwOCCTKjiV3tdnuhzFffsm4V" />
                </div>
                <span class="font-headline-sm text-headline-sm font-bold">JobAlert CI</span>
              </div>
              <p class="font-body-sm text-white/70 leading-relaxed">
                Votre boussole vers l'emploi en Côte d'Ivoire. Recevez les meilleures opportunités directement
                dans votre boîte mail.
              </p>
              <div class="flex gap-sm">
                <a class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                  href="#">
                  <span class="material-symbols-outlined text-[20px]">facebook</span>
                </a>
                <a class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                  href="#">
                  <span class="material-symbols-outlined text-[20px]">share</span>
                </a>
                <a class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                  href="#">
                  <span class="material-symbols-outlined text-[20px]">link</span>
                </a>
              </div>
            </div>
            <div class="flex flex-col gap-md">
              <h4 class="font-label-md text-label-md uppercase tracking-wider text-brand-orange">Navigation</h4>
              <ul class="flex flex-col gap-sm font-body-sm text-white/70">
                <li><a class="hover:text-white transition-colors" href="#">Accueil</a></li>
                <li><a class="hover:text-white transition-colors" href="#">Comment ça marche</a></li>
                <li><a class="hover:text-white transition-colors" href="#">Offres d'emploi</a></li>
                <li><a class="hover:text-white transition-colors" href="#">Publier une offre</a></li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4 class="font-label-md text-label-md uppercase tracking-wider text-brand-orange">Support &amp;
                Légal</h4>
              <ul class="flex flex-col gap-sm font-body-sm text-white/70">
                <li><a class="hover:text-white transition-colors" href="#">Contact</a></li>
                <li><a class="hover:text-white transition-colors" href="#">À propos</a></li>
                <li><a class="hover:text-white transition-colors" href="#">FAQ</a></li>
                <li><a class="hover:text-white transition-colors" href="#">Mentions Légales</a></li>
                <li><a class="hover:text-white transition-colors" href="#">Confidentialité</a></li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4 class="font-label-md text-label-md uppercase tracking-wider text-brand-orange">Newsletter</h4>
              <p class="font-body-sm text-white/70">Ne manquez aucune offre importante.</p>
              <div class="flex flex-col gap-2">
                <input
                  class="bg-white/10 border border-white/20 rounded px-4 py-2 text-body-sm focus:outline-none focus:border-brand-orange"
                  placeholder="Votre email" type="email" />
                <button
                  class="bg-brand-orange text-white font-label-md py-2 rounded hover:brightness-110 transition-all">S'abonner</button>
              </div>
            </div>
          </div>
          <div
            class="pt-lg border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-md text-white/50 font-body-sm">
            <p>© 2024 JobAlert CI. Tous droits réservés.</p>
            <p class="flex items-center gap-1">Fait avec passion pour la Côte d'Ivoire <span
              class="text-brand-orange">❤</span></p>
          </div>
        </div>
      </footer>
    </body>
  )
}

export default Home