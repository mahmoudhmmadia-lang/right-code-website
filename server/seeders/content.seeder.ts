import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { translator } from "./cms-translator.data";
import { homeExperienceData } from "./home-experience.data";
import { projectWizardData } from "./project-wizard.data";
import { routeSections } from "./route-sections.data";

const prisma = new PrismaClient();

const services = [
  {
    slug: "custom-platforms",
    icon: "code",
    sortOrder: 10,
    isFeatured: true,
    translations: {
      en: {
        title: "Custom platforms & internal systems",
        subtitle: "Built around your operation",
        description:
          "Business-critical applications shaped around your workflows, users, and data — from internal tools to sector-specific platforms.",
        outcome:
          "A maintainable system that fits the organization instead of forcing the organization to fit the software.",
      },
      ar: {
        title: "منصات مخصصة وأنظمة داخلية",
        subtitle: "مصممة حول عملياتك",
        description:
          "تطبيقات أساسية للأعمال مبنية وفق سير العمل والمستخدمين والبيانات، من الأدوات الداخلية إلى المنصات المتخصصة.",
        outcome:
          "نظام قابل للصيانة يناسب المؤسسة بدلاً من إجبار المؤسسة على التكيف معه.",
      },
      tr: {
        title: "Özel platformlar ve iç sistemler",
        subtitle: "Operasyonunuza göre tasarlandı",
        description:
          "İş akışlarınıza, kullanıcılarınıza ve verilerinize göre şekillenen kritik uygulamalar ve sektörel platformlar.",
        outcome:
          "Kuruluşu yazılıma uydurmak yerine kuruluşa uyan, sürdürülebilir bir sistem.",
      },
    },
  },
  {
    slug: "dashboards-reporting",
    icon: "chart",
    sortOrder: 20,
    isFeatured: true,
    translations: {
      en: {
        title: "Dashboards & reporting",
        subtitle: "See what matters now",
        description:
          "Real-time dashboards and analytics that turn operational data into clear, actionable information.",
        outcome:
          "Shared visibility and faster decisions without manual spreadsheet reporting.",
      },
      ar: {
        title: "لوحات المعلومات والتقارير",
        subtitle: "رؤية واضحة لما يهم الآن",
        description:
          "لوحات وتحليلات فورية تحول البيانات التشغيلية إلى معلومات واضحة وقابلة للتنفيذ.",
        outcome: "رؤية مشتركة وقرارات أسرع دون تقارير يدوية متكررة.",
      },
      tr: {
        title: "Panolar ve raporlama",
        subtitle: "Önemli olanı şimdi görün",
        description:
          "Operasyonel verileri net ve uygulanabilir bilgiye dönüştüren gerçek zamanlı panolar.",
        outcome:
          "Manuel tablo raporları olmadan ortak görünürlük ve daha hızlı kararlar.",
      },
    },
  },
  {
    slug: "integration-automation",
    icon: "blocks",
    sortOrder: 30,
    isFeatured: true,
    translations: {
      en: {
        title: "Integration & automation",
        subtitle: "Connect the tools you already use",
        description:
          "We connect systems and databases, automate routine work, and remove fragile manual hand-offs.",
        outcome:
          "Reliable data flow across teams with fewer errors and less repetitive work.",
      },
      ar: {
        title: "التكامل والأتمتة",
        subtitle: "اربط الأدوات التي تستخدمها",
        description:
          "نربط الأنظمة وقواعد البيانات ونؤتمت العمل المتكرر ونزيل نقاط التسليم اليدوية الهشة.",
        outcome: "تدفق موثوق للبيانات بين الفرق مع أخطاء أقل وعمل متكرر أقل.",
      },
      tr: {
        title: "Entegrasyon ve otomasyon",
        subtitle: "Kullandığınız araçları bağlayın",
        description:
          "Sistemleri ve veritabanlarını bağlar, rutin işleri otomatikleştirir ve kırılgan manuel aktarımları kaldırırız.",
        outcome:
          "Daha az hata ve tekrar ile ekipler arasında güvenilir veri akışı.",
      },
    },
  },
  {
    slug: "secure-infrastructure",
    icon: "shield",
    sortOrder: 40,
    isFeatured: false,
    translations: {
      en: {
        title: "Secure infrastructure",
        subtitle: "Deploy with confidence",
        description:
          "Cloud or on-premise deployment with security, observability, backups, and data ownership designed in.",
        outcome:
          "Stable delivery with a clear operational model and no avoidable infrastructure surprises.",
      },
      ar: {
        title: "بنية تحتية آمنة",
        subtitle: "انشر بثقة",
        description:
          "نشر سحابي أو محلي يضع الأمان والمراقبة والنسخ الاحتياطي وملكية البيانات ضمن التصميم.",
        outcome: "تشغيل مستقر ونموذج واضح دون مفاجآت بنيوية يمكن تجنبها.",
      },
      tr: {
        title: "Güvenli altyapı",
        subtitle: "Güvenle yayınlayın",
        description:
          "Güvenlik, gözlemlenebilirlik, yedekleme ve veri sahipliğiyle bulut veya şirket içi kurulum.",
        outcome: "Net bir işletim modeliyle istikrarlı teslimat.",
      },
    },
  },
  {
    slug: "support-evolution",
    icon: "wrench",
    sortOrder: 50,
    isFeatured: false,
    translations: {
      en: {
        title: "Support & continuous evolution",
        subtitle: "Built beyond launch day",
        description:
          "Monitoring, maintenance, training, and iterative improvements as your users and needs evolve.",
        outcome:
          "A living system that stays useful, secure, and aligned over the long term.",
      },
      ar: {
        title: "الدعم والتطوير المستمر",
        subtitle: "ما بعد يوم الإطلاق",
        description:
          "مراقبة وصيانة وتدريب وتحسينات متتابعة مع تطور المستخدمين والاحتياجات.",
        outcome: "نظام حي يبقى مفيداً وآمناً ومتوافقاً على المدى الطويل.",
      },
      tr: {
        title: "Destek ve sürekli gelişim",
        subtitle: "Yayın gününün ötesinde",
        description:
          "Kullanıcılar ve ihtiyaçlar geliştikçe izleme, bakım, eğitim ve düzenli iyileştirmeler.",
        outcome:
          "Uzun vadede yararlı, güvenli ve uyumlu kalan yaşayan bir sistem.",
      },
    },
  },
];

const projects = [
  {
    projectNumber: "RC-004",
    name: "KayanOS",
    slug: "kayanos-work-operating-system",
    clientName: "KayanOS",
    completionYear: 2026,
    projectUrl: "https://kayanos.app/",
    coverImageUrl: "https://kayanos.com/logo.png",
    accentColor: "#176b66",
    technologies: ["Web platform", "Progressive web app", "Workflow automation", "Analytics", "AI assistance"],
    translations: {
      en: {
        title: "KayanOS — one place to run the work",
        subtitle: "Operations & project management platform",
        summary:
          "A unified workspace for turning organizational goals into clear procedures, coordinated projects, visible progress, and day-to-day action.",
        context:
          "Growing organizations often operate across disconnected task tools, documents, spreadsheets, email, and informal processes. Teams need structure without adding another rigid system.",
        challenges:
          "Bring procedures, projects, people, reporting, and collaboration into one understandable product while keeping complex operational work approachable for every role.",
        solution:
          "KayanOS creates a shared operating layer where teams can standardize procedures, manage tasks and budgets, track progress visually, collaborate, and use data to guide the next decision.",
        services: ["Product strategy", "UX and interface design", "Platform engineering", "Workflow architecture", "Quality assurance"],
        keyElements: [
          "Procedure and workflow builder",
          "Project, task, and budget management",
          "Dashboards and operational reporting",
          "Team collaboration and document workflows",
          "AI-assisted guidance and recommendations",
        ],
        results: [
          "One clear workspace instead of scattered operational tools",
          "Reusable procedures that make execution more consistent",
          "Live visibility for teams and decision-makers",
          "A flexible foundation for startups, enterprises, and nonprofits",
        ],
        impactSummary: "KayanOS turns scattered operational knowledge into a visible, repeatable system—giving teams a clearer way to coordinate work and leaders a more dependable view of progress.",
        metaTitle: "KayanOS work operating system case study",
        metaDescription: "Explore KayanOS, a unified platform for procedures, projects, tasks, reporting, collaboration, and AI-assisted operations.",
      },
      ar: {
        title: "KayanOS — مكان واحد لإدارة العمل",
        subtitle: "منصة لإدارة العمليات والمشاريع",
        summary:
          "مساحة عمل موحّدة تحوّل أهداف المؤسسة إلى إجراءات واضحة ومشاريع منسقة وتقدم مرئي وعمل يومي منظم.",
        context:
          "تعمل المؤسسات النامية غالباً عبر أدوات مهام ووثائق وجداول وبريد إلكتروني وعمليات غير مترابطة، وتحتاج إلى هيكل واضح دون إضافة نظام جامد جديد.",
        challenges:
          "جمع الإجراءات والمشاريع والأشخاص والتقارير والتعاون في منتج واحد مفهوم، مع إبقاء العمل التشغيلي المعقد سهلاً لكل دور.",
        solution:
          "يوفر KayanOS طبقة تشغيل مشتركة لتوحيد الإجراءات وإدارة المهام والميزانيات ومتابعة التقدم بصرياً والتعاون واتخاذ القرارات بالاعتماد على البيانات.",
        services: ["استراتيجية المنتج", "تصميم التجربة والواجهات", "هندسة المنصة", "هندسة مسارات العمل", "ضمان الجودة"],
        keyElements: [
          "منشئ الإجراءات ومسارات العمل",
          "إدارة المشاريع والمهام والميزانيات",
          "لوحات المعلومات والتقارير التشغيلية",
          "تعاون الفرق ومسارات الوثائق",
          "إرشاد وتوصيات مدعومة بالذكاء الاصطناعي",
        ],
        results: [
          "مساحة عمل واضحة بدلاً من الأدوات التشغيلية المتفرقة",
          "إجراءات قابلة لإعادة الاستخدام لتنفيذ أكثر اتساقاً",
          "رؤية مباشرة للفرق وصنّاع القرار",
          "أساس مرن للشركات والمؤسسات والمنظمات",
        ],
        impactSummary: "يحوّل KayanOS المعرفة التشغيلية المتفرقة إلى نظام واضح وقابل للتكرار، فيمنح الفرق طريقة أفضل لتنسيق العمل والإدارة رؤية أكثر موثوقية للتقدم.",
        metaTitle: "دراسة مشروع نظام العمل KayanOS",
        metaDescription: "استكشف KayanOS، المنصة الموحدة للإجراءات والمشاريع والمهام والتقارير والتعاون والعمليات المدعومة بالذكاء الاصطناعي.",
      },
      tr: {
        title: "KayanOS — işi tek yerden yönetin",
        subtitle: "Operasyon ve proje yönetim platformu",
        summary:
          "Kurumsal hedefleri net prosedürlere, koordineli projelere, görünür ilerlemeye ve düzenli günlük çalışmaya dönüştüren birleşik çalışma alanı.",
        context:
          "Büyüyen kuruluşlar çoğu zaman kopuk görev araçları, belgeler, tablolar, e-posta ve gayriresmî süreçlerle çalışır. Ekiplerin yeni bir katı sistem değil, anlaşılır bir yapıya ihtiyacı vardır.",
        challenges:
          "Prosedürleri, projeleri, insanları, raporlamayı ve iş birliğini tek anlaşılır üründe birleştirirken karmaşık operasyonları her rol için erişilebilir tutmak.",
        solution:
          "KayanOS; prosedürleri standartlaştırmak, görev ve bütçeleri yönetmek, ilerlemeyi görsel olarak izlemek, iş birliği yapmak ve veriye dayalı karar almak için ortak bir işletim katmanı sunar.",
        services: ["Ürün stratejisi", "UX ve arayüz tasarımı", "Platform mühendisliği", "İş akışı mimarisi", "Kalite güvencesi"],
        keyElements: [
          "Prosedür ve iş akışı oluşturucu",
          "Proje, görev ve bütçe yönetimi",
          "Panolar ve operasyonel raporlama",
          "Ekip iş birliği ve belge akışları",
          "Yapay zekâ destekli rehberlik ve öneriler",
        ],
        results: [
          "Dağınık operasyon araçları yerine tek net çalışma alanı",
          "Daha tutarlı uygulama için yeniden kullanılabilir prosedürler",
          "Ekipler ve karar vericiler için canlı görünürlük",
          "Girişimler, kurumlar ve STK'lar için esnek temel",
        ],
        impactSummary: "KayanOS, dağınık operasyon bilgisini görünür ve tekrarlanabilir bir sisteme dönüştürerek ekiplere koordinasyon, yöneticilere ise ilerleme konusunda daha güvenilir bir görünüm sağlar.",
        metaTitle: "KayanOS iş işletim sistemi vaka çalışması",
        metaDescription: "Prosedürler, projeler, görevler, raporlama, iş birliği ve yapay zekâ destekli operasyonlar için KayanOS platformunu keşfedin.",
      },
    },
  },
  {
    projectNumber: "RC-001",
    name: "Government Case Management",
    slug: "government-case-management",
    clientName: "Public service organization",
    completionYear: 2025,
    accentColor: "#264f73",
    technologies: ["React", "Node.js", "MongoDB", "Docker"],
    translations: {
      en: {
        title: "Centralized case tracking",
        subtitle: "Public sector",
        summary:
          "A secure workflow and approvals platform replacing email, spreadsheets, and paper-based tracking.",
        context: "A public-service team needed one reliable view of cases moving across departments, reviewers, and approval levels.",
        challenges: "Fragmented records, manual follow-up, unclear ownership, and limited auditability made service delivery slower and harder to manage.",
        solution: "We designed a role-based case workspace with structured intake, approval routes, deadlines, searchable records, and live management views.",
        services: ["Service design", "Workflow architecture", "Full-stack engineering", "Secure deployment"],
        keyElements: ["Role-based access", "Configurable approval workflows", "Searchable audit trail", "Operational dashboards"],
        results: [
          "60% less follow-up time",
          "Real-time visibility into blocked cases",
          "A complete searchable audit trail",
        ],
        impactSummary: "A single case workspace replaced fragmented follow-up and gave every responsible team a shared, auditable view of service delivery.",
      },
      ar: {
        title: "نظام مركزي لمتابعة المعاملات",
        subtitle: "القطاع العام",
        summary:
          "منصة آمنة لسير العمل والموافقات تستبدل البريد والجداول والمتابعة الورقية.",
        context: "احتاج فريق خدمات عامة إلى رؤية موثوقة وموحدة للمعاملات أثناء انتقالها بين الأقسام والمراجعين ومستويات الموافقة.",
        challenges: "أدت السجلات المتفرقة والمتابعة اليدوية وعدم وضوح المسؤولية وضعف التدقيق إلى إبطاء تقديم الخدمة.",
        solution: "صممنا مساحة معاملات قائمة على الصلاحيات مع إدخال منظم ومسارات موافقة ومهل وسجلات قابلة للبحث ولوحات متابعة مباشرة.",
        services: ["تصميم الخدمة", "هندسة مسارات العمل", "الهندسة البرمجية المتكاملة", "النشر الآمن"],
        keyElements: ["وصول قائم على الأدوار", "مسارات موافقة قابلة للتهيئة", "سجل تدقيق قابل للبحث", "لوحات تشغيلية"],
        results: [
          "خفض وقت المتابعة بنسبة ٦٠٪",
          "رؤية فورية للمعاملات المتعثرة",
          "سجل تدقيق كامل وقابل للبحث",
        ],
        impactSummary: "استبدلت مساحة المعاملات الموحدة المتابعة المتفرقة ومنحت جميع الفرق المسؤولة رؤية مشتركة وقابلة للتدقيق لتقديم الخدمة.",
      },
      tr: {
        title: "Merkezi vaka takibi",
        subtitle: "Kamu sektörü",
        summary:
          "E-posta, tablolar ve kağıt takibinin yerini alan güvenli iş akışı platformu.",
        context: "Bir kamu hizmeti ekibinin departmanlar, inceleyenler ve onay seviyeleri arasında ilerleyen vakalar için tek güvenilir görünüme ihtiyacı vardı.",
        challenges: "Dağınık kayıtlar, manuel takip, belirsiz sahiplik ve sınırlı denetlenebilirlik hizmet sunumunu yavaşlatıyordu.",
        solution: "Yapılandırılmış kayıt, onay rotaları, son tarihler, aranabilir geçmiş ve canlı yönetim görünümleri olan rol tabanlı bir çalışma alanı tasarladık.",
        services: ["Hizmet tasarımı", "İş akışı mimarisi", "Full-stack mühendislik", "Güvenli dağıtım"],
        keyElements: ["Rol tabanlı erişim", "Yapılandırılabilir onay akışları", "Aranabilir denetim izi", "Operasyon panoları"],
        results: [
          "Takip süresinde %60 azalma",
          "Engellenen vakalarda anlık görünürlük",
          "Aranabilir denetim geçmişi",
        ],
        impactSummary: "Tek bir vaka çalışma alanı dağınık takibin yerini aldı ve tüm sorumlu ekiplere hizmet sunumunun ortak, denetlenebilir görünümünü sağladı.",
      },
    },
  },
  {
    projectNumber: "RC-002",
    name: "NGO Program Platform",
    slug: "ngo-program-platform",
    clientName: "International NGO",
    completionYear: 2025,
    accentColor: "#9b5b35",
    technologies: ["React", "Express", "MongoDB", "Analytics"],
    translations: {
      en: {
        title: "Program & beneficiary management",
        subtitle: "International NGO",
        summary:
          "One consistent platform for programs, partners, beneficiaries, and donor-ready reporting.",
        context: "Regional program teams needed to coordinate delivery partners and beneficiary services while maintaining dependable donor reporting.",
        challenges: "Different offices used different definitions and files, creating duplicate records, delayed consolidation, and low confidence in reports.",
        solution: "We created a shared program data model, guided workflows, validation rules, and reporting views tailored to field teams and leadership.",
        services: ["Program discovery", "Data modeling", "Platform engineering", "Reporting design"],
        keyElements: ["Beneficiary records", "Partner workflows", "Program indicators", "Donor-ready exports"],
        results: [
          "Unified regional data",
          "Faster donor reporting",
          "Consistent beneficiary records",
        ],
        impactSummary: "Regional teams moved from incompatible files to one program record, improving reporting readiness and confidence in beneficiary data.",
      },
      ar: {
        title: "إدارة البرامج والمستفيدين",
        subtitle: "منظمة دولية",
        summary:
          "منصة موحدة للبرامج والشركاء والمستفيدين والتقارير الجاهزة للمانحين.",
        context: "احتاجت فرق البرامج الإقليمية إلى تنسيق الشركاء وخدمات المستفيدين مع الحفاظ على تقارير موثوقة للمانحين.",
        challenges: "استخدمت المكاتب تعريفات وملفات مختلفة، ما أدى إلى سجلات مكررة وتأخر التجميع وضعف الثقة بالتقارير.",
        solution: "أنشأنا نموذج بيانات مشتركاً للبرامج ومسارات عمل موجهة وقواعد تحقق وتقارير تناسب الفرق الميدانية والإدارة.",
        services: ["اكتشاف البرامج", "نمذجة البيانات", "هندسة المنصة", "تصميم التقارير"],
        keyElements: ["سجلات المستفيدين", "مسارات عمل الشركاء", "مؤشرات البرامج", "تصدير جاهز للمانحين"],
        results: [
          "بيانات موحدة بين المناطق",
          "تقارير أسرع للمانحين",
          "سجلات مستفيدين متسقة",
        ],
        impactSummary: "انتقلت الفرق الإقليمية من ملفات غير متوافقة إلى سجل برامج موحد، ما حسّن جاهزية التقارير والثقة ببيانات المستفيدين.",
      },
      tr: {
        title: "Program ve yararlanıcı yönetimi",
        subtitle: "Uluslararası STK",
        summary:
          "Programlar, ortaklar, yararlanıcılar ve bağışçı raporları için tek platform.",
        context: "Bölgesel program ekiplerinin ortakları ve yararlanıcı hizmetlerini koordine ederken güvenilir bağışçı raporlamasını sürdürmesi gerekiyordu.",
        challenges: "Farklı ofislerin farklı tanım ve dosyaları yinelenen kayıtlara, gecikmeli birleştirmeye ve raporlara düşük güvene yol açıyordu.",
        solution: "Saha ekipleri ve yöneticiler için ortak program veri modeli, yönlendirilmiş akışlar, doğrulama kuralları ve raporlama görünümleri oluşturduk.",
        services: ["Program keşfi", "Veri modelleme", "Platform mühendisliği", "Raporlama tasarımı"],
        keyElements: ["Yararlanıcı kayıtları", "Ortak iş akışları", "Program göstergeleri", "Bağışçıya hazır dışa aktarımlar"],
        results: [
          "Birleşik bölgesel veri",
          "Daha hızlı raporlama",
          "Tutarlı yararlanıcı kayıtları",
        ],
        impactSummary: "Bölgesel ekipler uyumsuz dosyalardan tek program kaydına geçerek raporlama hazırlığını ve yararlanıcı verisine güveni geliştirdi.",
      },
    },
  },
  {
    projectNumber: "RC-003",
    name: "Operations Intelligence",
    slug: "operations-intelligence",
    clientName: "Operations leadership team",
    completionYear: 2024,
    accentColor: "#4d477d",
    technologies: ["TypeScript", "React", "PostgreSQL", "BI"],
    translations: {
      en: {
        title: "Operations intelligence platform",
        subtitle: "Private sector",
        summary:
          "Live operational dashboards and automated reporting built on a reliable source of truth.",
        context: "Leadership needed to understand daily performance across teams without waiting for manually assembled weekly reports.",
        challenges: "Metrics came from disconnected sources, definitions varied, and analysts spent too much time reconciling data instead of explaining it.",
        solution: "We unified core operational data, documented metric ownership, automated recurring reports, and designed role-specific decision dashboards.",
        services: ["Analytics strategy", "Data integration", "Dashboard design", "Reporting automation"],
        keyElements: ["Shared metric definitions", "Automated data flows", "Role-based dashboards", "Scheduled reporting"],
        results: [
          "Faster executive decisions",
          "Automated recurring reports",
          "Clear ownership of every metric",
        ],
        impactSummary: "A governed reporting layer gave leaders faster answers while reducing the recurring manual work required from analysts.",
      },
      ar: {
        title: "منصة ذكاء العمليات",
        subtitle: "القطاع الخاص",
        summary:
          "لوحات تشغيل مباشرة وتقارير مؤتمتة مبنية على مصدر موثوق للبيانات.",
        context: "احتاجت الإدارة إلى فهم الأداء اليومي بين الفرق دون انتظار تقارير أسبوعية مجمعة يدوياً.",
        challenges: "جاءت المؤشرات من مصادر منفصلة واختلفت تعريفاتها، وقضى المحللون وقتاً طويلاً في مطابقة البيانات بدلاً من تفسيرها.",
        solution: "وحّدنا البيانات التشغيلية الأساسية ووثقنا ملكية المؤشرات وأتمتنا التقارير الدورية وصممنا لوحات قرار لكل دور.",
        services: ["استراتيجية التحليلات", "تكامل البيانات", "تصميم اللوحات", "أتمتة التقارير"],
        keyElements: ["تعريفات مشتركة للمؤشرات", "تدفقات بيانات مؤتمتة", "لوحات حسب الدور", "تقارير مجدولة"],
        results: [
          "قرارات إدارية أسرع",
          "تقارير دورية مؤتمتة",
          "ملكية واضحة لكل مؤشر",
        ],
        impactSummary: "وفرت طبقة التقارير المحكومة إجابات أسرع للإدارة وخفّضت العمل اليدوي الدوري المطلوب من المحللين.",
      },
      tr: {
        title: "Operasyon zekâsı platformu",
        subtitle: "Özel sektör",
        summary:
          "Güvenilir tek veri kaynağı üzerinde canlı panolar ve otomatik raporlama.",
        context: "Yönetimin, elle hazırlanan haftalık raporları beklemeden ekipler arasındaki günlük performansı anlaması gerekiyordu.",
        challenges: "Metrikler kopuk kaynaklardan geliyor, tanımlar değişiyor ve analistler veriyi açıklamak yerine uzlaştırmakla zaman kaybediyordu.",
        solution: "Temel operasyon verilerini birleştirdik, metrik sahipliğini belgeledik, dönemsel raporları otomatikleştirdik ve role özel karar panoları tasarladık.",
        services: ["Analitik stratejisi", "Veri entegrasyonu", "Pano tasarımı", "Raporlama otomasyonu"],
        keyElements: ["Ortak metrik tanımları", "Otomatik veri akışları", "Rol tabanlı panolar", "Planlı raporlama"],
        results: [
          "Daha hızlı yönetim kararları",
          "Otomatik dönemsel raporlar",
          "Her metrik için net sahiplik",
        ],
        impactSummary: "Yönetilen raporlama katmanı liderlere daha hızlı yanıtlar sağlarken analistlerin tekrarlanan manuel işini azalttı.",
      },
    },
  },
];

const jobTitles = [
  {
    key: "frontend-engineer",
    sortOrder: 10,
    translations: {
      en: { title: "Frontend Engineer" },
      ar: { title: "مهندس واجهات أمامية" },
      tr: { title: "Frontend Mühendisi" },
    },
  },
  {
    key: "backend-engineer",
    sortOrder: 20,
    translations: {
      en: { title: "Backend Engineer" },
      ar: { title: "مهندس خلفيات برمجية" },
      tr: { title: "Backend Mühendisi" },
    },
  },
  {
    key: "fullstack-engineer",
    sortOrder: 30,
    translations: {
      en: { title: "Full-stack Engineer" },
      ar: { title: "مهندس برمجيات متكامل" },
      tr: { title: "Full-stack Mühendisi" },
    },
  },
  {
    key: "product-designer",
    sortOrder: 40,
    translations: {
      en: { title: "Product Designer" },
      ar: { title: "مصمم منتجات رقمية" },
      tr: { title: "Ürün Tasarımcısı" },
    },
  },
  {
    key: "project-manager",
    sortOrder: 50,
    translations: {
      en: { title: "Project Manager" },
      ar: { title: "مدير مشاريع" },
      tr: { title: "Proje Yöneticisi" },
    },
  },
  {
    key: "quality-engineer",
    sortOrder: 60,
    translations: {
      en: { title: "Quality Engineer" },
      ar: { title: "مهندس ضمان جودة" },
      tr: { title: "Kalite Mühendisi" },
    },
  },
];

const teamMembers = [
  {
    slug: "mahmoud-al-khatib",
    fullName: "Mahmoud Al-Khatib",
    jobTitleKey: "fullstack-engineer",
    sortOrder: 10,
    translations: {
      en: {
        fullName: "Mahmoud Al-Khatib",
        bio: "Builds dependable product foundations from architecture through launch.",
      },
      ar: {
        fullName: "محمود الخطيب",
        bio: "يبني أسساً تقنية موثوقة للمنتجات من هندسة النظام حتى الإطلاق.",
      },
      tr: { fullName: "Mahmoud Al-Khatib", bio: "Mimariden yayına kadar güvenilir ürün temelleri oluşturur." },
    },
  },
  {
    slug: "sara-hassan",
    fullName: "Sara Hassan",
    jobTitleKey: "product-designer",
    sortOrder: 20,
    translations: {
      en: {
        fullName: "Sara Hassan",
        bio: "Turns complex workflows into calm, accessible product experiences.",
      },
      ar: {
        fullName: "سارة حسن",
        bio: "تحوّل مسارات العمل المعقدة إلى تجارب رقمية واضحة وسهلة الوصول.",
      },
      tr: {
        fullName: "Sara Hassan",
        bio: "Karmaşık iş akışlarını sade ve erişilebilir ürün deneyimlerine dönüştürür.",
      },
    },
  },
  {
    slug: "omar-darwish",
    fullName: "Omar Darwish",
    jobTitleKey: "backend-engineer",
    sortOrder: 30,
    translations: {
      en: {
        fullName: "Omar Darwish",
        bio: "Designs secure services and data systems that stay fast as they grow.",
      },
      ar: { fullName: "عمر درويش", bio: "يصمم خدمات وأنظمة بيانات آمنة تحافظ على سرعتها مع التوسع." },
      tr: {
        fullName: "Omar Darwish",
        bio: "Büyüdükçe hızlı kalan güvenli servisler ve veri sistemleri tasarlar.",
      },
    },
  },
  {
    slug: "lana-mustafa",
    fullName: "Lana Mustafa",
    jobTitleKey: "project-manager",
    sortOrder: 40,
    translations: {
      en: {
        fullName: "Lana Mustafa",
        bio: "Keeps delivery transparent, focused, and aligned with business outcomes.",
      },
      ar: { fullName: "لانا مصطفى", bio: "تحافظ على شفافية التنفيذ وتركيزه وارتباطه بنتائج العمل." },
      tr: { fullName: "Lana Mustafa", bio: "Teslimatı şeffaf, odaklı ve iş sonuçlarıyla uyumlu tutar." },
    },
  },
];

const blogPosts = [
  {
    slug: "designing-software-for-long-term-change",
    publishedAt: new Date("2026-07-18T09:00:00.000Z"),
    authorName: "Right Code Engineering",
    readMinutes: 7,
    sortOrder: 10,
    isFeatured: true,
    tags: ["architecture", "product strategy"],
    translations: {
      en: {
        title: "Designing software for change, not just launch day",
        excerpt:
          "The architectural decisions that keep a product adaptable when workflows, teams, and priorities inevitably change.",
        category: "Engineering",
        content:
          "A successful launch is only the first checkpoint. Business software lives through new policies, new reporting needs, changing teams, and integrations that were not visible during the first roadmap.\n\nLong-lived systems start with clear boundaries. Business rules should not be trapped inside screens, data ownership should be explicit, and integrations should be replaceable without rewriting the product.\n\nThe practical goal is not maximum abstraction. It is making the most likely changes inexpensive and safe. That means testing important rules, documenting operational decisions, and choosing boring, dependable foundations where novelty adds no real value.\n\nWhen architecture reflects how an organization actually works, the software can evolve with it instead of becoming the next constraint.",
      },
      ar: {
        title: "تصميم البرمجيات للتغيير، وليس ليوم الإطلاق فقط",
        excerpt:
          "قرارات هندسية تحافظ على قابلية المنتج للتطور مع تغير سير العمل والفرق والأولويات.",
        category: "الهندسة البرمجية",
        content:
          "الإطلاق الناجح ليس سوى نقطة البداية. تعيش برمجيات الأعمال مع سياسات جديدة واحتياجات تقارير متغيرة وفرق متجددة وتكاملات لم تكن ظاهرة في خارطة الطريق الأولى.\n\nتبدأ الأنظمة طويلة العمر بحدود واضحة. يجب ألا تبقى قواعد العمل محصورة داخل الواجهات، ويجب أن تكون ملكية البيانات واضحة، وأن يكون استبدال التكاملات ممكناً دون إعادة بناء المنتج.\n\nالهدف العملي ليس زيادة التعقيد، بل جعل التغييرات المتوقعة قليلة الكلفة وآمنة من خلال اختبار القواعد المهمة وتوثيق القرارات التشغيلية واختيار أسس موثوقة.\n\nعندما تعكس الهندسة طريقة عمل المؤسسة فعلياً، يمكن للبرنامج أن يتطور معها بدلاً من أن يصبح عائقاً جديداً.",
      },
      tr: {
        title: "Yazılımı yalnızca lansman için değil, değişim için tasarlamak",
        excerpt:
          "İş akışları, ekipler ve öncelikler değişirken ürünü uyarlanabilir tutan mimari kararlar.",
        category: "Mühendislik",
        content:
          "Başarılı bir yayın yalnızca ilk kontrol noktasıdır. İş yazılımları yeni politikalar, raporlama ihtiyaçları, değişen ekipler ve ilk yol haritasında görünmeyen entegrasyonlarla yaşamaya devam eder.\n\nUzun ömürlü sistemler net sınırlarla başlar. İş kuralları ekranlara hapsolmamalı, veri sahipliği açık olmalı ve entegrasyonlar ürünü yeniden yazmadan değiştirilebilmelidir.\n\nPratik hedef en fazla soyutlama değildir. En olası değişiklikleri ucuz ve güvenli hale getirmektir.\n\nMimari kuruluşun gerçek çalışma biçimini yansıttığında yazılım yeni bir kısıt olmak yerine onunla birlikte gelişebilir.",
      },
    },
  },
  {
    slug: "from-spreadsheets-to-operational-visibility",
    publishedAt: new Date("2026-07-08T09:00:00.000Z"),
    authorName: "Right Code Product Team",
    readMinutes: 5,
    sortOrder: 20,
    isFeatured: false,
    tags: ["data", "operations"],
    translations: {
      en: {
        title: "From scattered spreadsheets to operational visibility",
        excerpt:
          "A practical path toward trustworthy reporting without disrupting the teams doing the work.",
        category: "Operations",
        content:
          "Spreadsheet problems are rarely caused by spreadsheets alone. They usually reveal unclear ownership, duplicated definitions, and workflows that depend on people remembering the next step.\n\nReplacing everything at once creates its own risk. A better approach starts with one valuable workflow, defines the source of truth, and makes the resulting status visible to everyone who needs it.\n\nAutomation should remove repeated hand-offs while preserving the context people need to make decisions. Dashboards then become the visible layer of a dependable process, not decoration placed over inconsistent data.\n\nThe result is less reporting work, faster intervention, and greater confidence in every operational conversation.",
      },
      ar: {
        title: "من الجداول المتفرقة إلى رؤية تشغيلية واضحة",
        excerpt:
          "مسار عملي نحو تقارير موثوقة دون تعطيل الفرق التي تنجز العمل اليومي.",
        category: "العمليات",
        content:
          "نادراً ما تكون مشكلة الجداول ناتجة عن الجداول وحدها. غالباً ما تكشف عن ملكية غير واضحة وتعريفات مكررة ومسارات تعتمد على تذكر الأشخاص للخطوة التالية.\n\nاستبدال كل شيء دفعة واحدة يخلق مخاطره الخاصة. يبدأ النهج الأفضل بمسار عمل واحد مهم، ويحدد مصدر الحقيقة، ويجعل الحالة مرئية لكل من يحتاجها.\n\nيجب أن تزيل الأتمتة عمليات التسليم المتكررة مع الحفاظ على السياق اللازم للقرار. عندها تصبح اللوحات واجهة لعملية موثوقة وليست مجرد زخرفة فوق بيانات غير متسقة.\n\nالنتيجة هي عمل تقارير أقل وتدخل أسرع وثقة أكبر في كل نقاش تشغيلي.",
      },
      tr: {
        title: "Dağınık tablolardan operasyonel görünürlüğe",
        excerpt:
          "Günlük işi yapan ekipleri aksatmadan güvenilir raporlamaya giden pratik bir yol.",
        category: "Operasyon",
        content:
          "Elektronik tablo sorunları nadiren yalnızca tablolardan kaynaklanır. Genellikle belirsiz sahipliği, yinelenen tanımları ve insanların bir sonraki adımı hatırlamasına bağlı iş akışlarını gösterir.\n\nHer şeyi bir anda değiştirmek yeni riskler yaratır. Daha iyi yaklaşım, değerli bir iş akışıyla başlar, doğruluk kaynağını tanımlar ve durumu ihtiyacı olan herkes için görünür kılar.\n\nOtomasyon, karar için gerekli bağlamı korurken tekrarlanan aktarımları kaldırmalıdır. Böylece panolar tutarsız verilerin üzerindeki süsler değil, güvenilir bir sürecin görünür katmanı olur.\n\nSonuç daha az raporlama işi, daha hızlı müdahale ve operasyonel konuşmalarda daha fazla güvendir.",
      },
    },
  },
  {
    slug: "security-is-a-product-decision",
    publishedAt: new Date("2026-06-25T09:00:00.000Z"),
    authorName: "Right Code Security",
    readMinutes: 6,
    sortOrder: 30,
    isFeatured: false,
    tags: ["security", "delivery"],
    translations: {
      en: {
        title: "Security is a product decision",
        excerpt:
          "Why access, auditability, recovery, and ownership belong in the product conversation from the beginning.",
        category: "Security",
        content:
          "Security cannot be added effectively as a final technical checklist. Access rules affect workflows, audit requirements affect data design, and recovery expectations affect infrastructure and operating cost.\n\nThese are product decisions because they change what users can do and how teams respond when something goes wrong. Discussing them early produces clearer roles, safer defaults, and fewer emergency changes near launch.\n\nGood security is often quiet. People see only the information they need, important actions are traceable, backups are tested, and ownership remains with the organization.\n\nThe strongest outcome is not a collection of controls. It is a system people can trust during ordinary work and difficult moments alike.",
      },
      ar: {
        title: "الأمان قرار في المنتج",
        excerpt:
          "لماذا يجب أن يكون الوصول والتدقيق والتعافي والملكية جزءاً من حوار المنتج منذ البداية.",
        category: "الأمان",
        content:
          "لا يمكن إضافة الأمان بفعالية كقائمة تقنية أخيرة. تؤثر قواعد الوصول في مسارات العمل، وتؤثر متطلبات التدقيق في تصميم البيانات، وتؤثر توقعات التعافي في البنية التحتية وكلفة التشغيل.\n\nهذه قرارات في المنتج لأنها تغير ما يستطيع المستخدمون فعله وكيف تستجيب الفرق عند حدوث مشكلة. مناقشتها مبكراً تنتج أدواراً أوضح وإعدادات أكثر أماناً وتغييرات طارئة أقل قرب الإطلاق.\n\nالأمان الجيد غالباً هادئ. يرى الأشخاص المعلومات التي يحتاجونها فقط، ويمكن تتبع الإجراءات المهمة، وتُختبر النسخ الاحتياطية، وتبقى الملكية لدى المؤسسة.\n\nالنتيجة الأقوى ليست مجموعة ضوابط، بل نظام يمكن للناس الوثوق به في العمل اليومي واللحظات الصعبة.",
      },
      tr: {
        title: "Güvenlik bir ürün kararıdır",
        excerpt:
          "Erişim, denetlenebilirlik, kurtarma ve sahipliğin neden en baştan ürün konuşmasına ait olduğu.",
        category: "Güvenlik",
        content:
          "Güvenlik son bir teknik kontrol listesi olarak etkili biçimde eklenemez. Erişim kuralları iş akışlarını, denetim gereksinimleri veri tasarımını, kurtarma beklentileri ise altyapıyı ve işletim maliyetini etkiler.\n\nBunlar ürün kararlarıdır; çünkü kullanıcıların yapabileceklerini ve bir sorun olduğunda ekiplerin nasıl tepki vereceğini değiştirir. Bunları erken konuşmak daha net roller, daha güvenli varsayılanlar ve yayın öncesinde daha az acil değişiklik sağlar.\n\nİyi güvenlik çoğu zaman sessizdir. İnsanlar yalnızca ihtiyaç duydukları bilgileri görür, önemli işlemler izlenebilir, yedekler test edilir ve sahiplik kuruluşta kalır.\n\nEn güçlü sonuç bir kontrol listesi değil, insanların hem günlük işte hem de zor anlarda güvenebildiği bir sistemdir.",
      },
    },
  },
];

const pageTranslations = {
  home: { en: "Home", ar: "الرئيسية", tr: "Ana Sayfa" },
  services: { en: "Services", ar: "الخدمات", tr: "Hizmetler" },
  work: { en: "Work", ar: "أعمالنا", tr: "Çalışmalar" },
  about: { en: "About", ar: "من نحن", tr: "Hakkımızda" },
  team: { en: "Team & careers", ar: "الفريق والوظائف", tr: "Ekip ve kariyer" },
  "create-project": {
    en: "Plan a project",
    ar: "خطط لمشروعك",
    tr: "Proje planla",
  },
  contact: { en: "Contact", ar: "تواصل معنا", tr: "İletişim" },
  blog: { en: "Insights", ar: "المقالات", tr: "İçgörüler" },
} as const;

async function seed() {
  for (const jobTitle of jobTitles) {
    const data = { ...jobTitle, isActive: true };
    await prisma.jobTitle.upsert({
      where: { key: jobTitle.key },
      update: data,
      create: data,
    });
  }

  for (const member of teamMembers) {
    const data = { ...member, isActive: true };
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: data,
      create: data,
    });
  }

  for (const service of services) {
    const data = { ...service, status: "PUBLISHED" };
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: data,
      create: data,
    });
  }

  for (const [index, project] of projects.entries()) {
    const data = {
      ...project,
      type: "CLIENT",
      status: "COMPLETED",
      visibility: "PUBLIC",
      progressPercent: 100,
      sortOrder: (index + 1) * 10,
      isFeatured: true,
    };
    await prisma.project.upsert({
      where: { projectNumber: project.projectNumber },
      update: data,
      create: data,
    });
  }

  for (const post of blogPosts) {
    const data = { ...post, status: "PUBLISHED" };
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: data,
      create: data,
    });
  }

  const pages = [
    "home",
    "services",
    "work",
    "about",
    "team",
    "blog",
    "create-project",
    "contact",
  ];
  for (const [index, slug] of pages.entries()) {
    const labels = pageTranslations[slug as keyof typeof pageTranslations];
    const data = {
      slug,
      kind: slug === "home" ? "HOME" : "STANDARD",
      status: "PUBLISHED",
      sortOrder: index * 10,
      isHomePage: slug === "home",
      translations: {
        en: { title: labels.en, navigationLabel: labels.en },
        ar: { title: labels.ar, navigationLabel: labels.ar },
        tr: { title: labels.tr, navigationLabel: labels.tr },
      },
    };
    await prisma.page.upsert({
      where: { slug },
      update: data,
      create: data,
    });
  }

  const copyData = {
    pageId: "home",
    key: "site-copy",
    type: "CUSTOM",
    status: "PUBLISHED",
    sortOrder: -100,
    translations: {
      en: { content: translator.en },
      ar: { content: translator.ar },
      tr: { content: translator.tr },
    },
  };
  const existingCopy = await prisma.section.findFirst({
    where: { pageId: "home", key: "site-copy" },
  });
  if (existingCopy) {
    await prisma.section.update({ where: { id: existingCopy.id }, data: copyData });
  } else {
    await prisma.section.create({ data: copyData });
  }

  const existingHomeExperience = await prisma.section.findFirst({
    where: { pageId: "home", key: "home-experience" },
  });
  if (existingHomeExperience) {
    await prisma.section.update({
      where: { id: existingHomeExperience.id },
      data: homeExperienceData,
    });
  } else {
    await prisma.section.create({ data: homeExperienceData });
  }

  for (const section of routeSections) {
    const existing = await prisma.section.findFirst({
      where: { pageId: section.pageId, key: section.key },
    });
    if (existing) {
      await prisma.section.update({ where: { id: existing.id }, data: section });
    } else {
      await prisma.section.create({ data: section });
    }
  }

  const existingProjectWizard = await prisma.section.findFirst({
    where: { pageId: projectWizardData.pageId, key: projectWizardData.key },
  });
  if (existingProjectWizard) {
    await prisma.section.update({
      where: { id: existingProjectWizard.id },
      data: projectWizardData,
    });
  } else {
    await prisma.section.create({ data: projectWizardData });
  }

  console.log("Content seed completed.");
}

seed().finally(() => prisma.$disconnect());
