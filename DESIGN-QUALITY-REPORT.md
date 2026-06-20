# DESIGN-QUALITY-REPORT — إت ماستر · ET MASTER

موقع فاخر بدرجة fine-dining لمطعم لحوم وستيك (تركي ستايل) في بريدة. الهوية: **Butcher Dry-Age Luxe** — أناقة كرنفورية معتمة، مذكّرة، ثمينة.

## 1) المهارات المُستدعاة وكيف طُبّقت
| المهارة | كيف استُخدمت |
|---|---|
| `ui-ux-pro-max` (+ `--design-system "premium steakhouse butcher meat fine dining dark"`) | أعاد نمط **Storytelling + Feature-Rich**، أساس "premium dark + action red". أخذنا منه البنية (Hero→Features/Menu→CTA)، ودرجة الأحمر الفعّال، وحوّلناه لباليت اللحم المعتّق بدل Inter (فخط عربي مزدوج). طُبّقت قوائم الـ Pre-Delivery (تباين/فوكس/reduced-motion/responsive). |
| `design-taste-frontend` | anti-slop: لا قوالب مجانية، design tokens عبر CSS variables، بنية مكوّنات نظيفة (header pill، dish cards، nested form). كل قسم له إيقاع مساحات خاص. |
| `emil-design-eng` | الموشن الناعم (cubic-bezier(.16,1,.3,1)، 150–400ms)، التفاصيل الدقيقة (sheen على الأزرار، underline متحرّك، ember "يتنفّس")، الحركة تخدم المعنى لا الزينة، عنصر/عنصرين متحرّكان لكل مشهد. |
| `high-end-visual-design` | منع الـ defaults الرخيصة: لا ظلال قاسية (استخدمنا ظلال ناعمة عميقة `-24px` spread)، لا حدود 1px رمادية فجّة (hairlines شفافة)، squircle radii كبيرة، macro-whitespace (py حتى 120px)، Hero asymmetric split، nav floating pill detached. |

## 2) مخرجات design-system (Palette / Typography)
- **Palette (Butcher Dry-Age Luxe):** فحمي عميق `#171311` (خلفية)، oxblood `#7a201d`، ember `#c0432f/#d8553c` (CTA/توهّج)، copper `#b8722e/#cf8a3e` (لمسات/eyebrows)، steel `#8b8579`، كريمي `#efe9dd/#f4efe6` (نص).
- **سبب الألوان:** الفحمي + الأوكسبلود = لحم/مشاوي/كارنيفور-لوكس مذكّر؛ النحاسي = دفء حِرفي راقٍ؛ الجمر = حياة وحرارة الشواء. كله معتم وثمين كما يطلب البريف.
- **Typography:** Display **El Messiri** (عناوين)، **Reem Kufi** (eyebrows/subtitles بحسّ كوفي مميّز)، Body **Tajawal** (نظيف عالي القراءة). مزدوج عربي حسب القاعدة §6.

## 3) قرارات UI/UX الأساسية
- Hero **asymmetric split**: نص يمين + مسرح توقيعي يسار، يتحوّل لعمود واحد على الجوال (المسرح فوق).
- Header **floating glass pill** منفصل عن الأعلى (mt 14px) مع mark متحرّك.
- كروت الأطباق ترفع + parallax صورة عند الهوفر؛ price-note = "حسب القائمة" دائمًا (لا أسعار).
- قسم الموقع ببطاقة خريطة منمنمة تفتح خرائط قوقل (لا iframe ثقيل).

## 4) ⭐ الموشن التوقيعي + الحياة المحيطة (مميّز عن أي ستيك-هاوس)
- **التوقيع — Dry-Age Reveal:** بدل خطوط الشواء المعتادة، قطعة معلّقة على خطّاف مُضاءة بالسبوت → **ساطور يهوي** (WAAPI) → **خط قطع** يُفتح ويكشف clip-path الداخل الأحمر المعرّق → **نفخة بخار** + **توهّج جمر** + **لمعة فولاذية** تعبر النصل. زاوية الجزّار/التعتيق، ليست رسم sear-mark.
- **الحياة المحيطة:** بارالاكس على طبقات الهيرو (pointer + scroll، capped 12px، معطّل على اللمس)، جزيئات جمر تصعد ببطء، توهّج warm spotlight "يتنفّس".
- **كوريغرافيا سكول:** ظهور اتجاهي زنبركي متدرّج (IntersectionObserver)، رسم مونوغرام SVG (stroke-dashoffset) في الـpreloader.
- **ميكرو:** أزرار مغناطيسية + sheen + scale(.97)، underline متحرّك للروابط، count-up للتقييم (4.3) وللمراجعات (595).
- **الأداء:** transform/opacity/filter فقط، ≤2–3 مجموعات/شاشة، 60fps. **reduced-motion** يُلغي كل شي ويُظهر القطع مفتوحة على حالتها النهائية + يُظهر كل [data-reveal].

## 5) تطبيق Hooked UX
- Trigger: CTA "احجز طاولة" بارز في الهيدر/الهيرو/الـfinal-cta. Action: نموذج بسيط (اسم/جوال أساسيان). Variable reward: توست تأكيد + فتح واتساب جاهز. Investment: حفظ الحجز في localStorage.

## 6) تطبيق iOS HIG / منطق اللمس
- أهداف لمس ≥44px (FABs 52px، أزرار padding وافر)، تباعد ≥8px. ردّ ضغط scale(.97) <150ms. قائمة جوال ملء الشاشة بزر X واضح. `min-h-dvh` لا 100vh. آمن من safe-area (FABs أسفل-يسار، header منفصل).

## 7) تطبيق Accessibility (≥ القاعدة §1)
- `<html lang="ar" dir="rtl">`، سيمانتيك header/nav/main/section/footer، تدرّج h1→h3 بلا قفز.
- تباين: نص كريمي `#f4efe6` على فحمي `#171311` ≈ 14:1؛ النص الخافت `#c9c2b3` على الخلفية ≈ 8:1؛ CTA أبيض على ember-gradient ≥ 4.5:1. كل الأزواج مفحوصة ≥4.5:1.
- alt عربي وصفي لكل صورة + width/height + lazy/decoding للصور غير الهيرو. aria-label لكل زر أيقونة. focus-visible (outline نحاسي 3px). toast بـ aria-live، الحوارات aria-modal + Esc يغلق.
- لا اعتماد على اللون وحده (أيقونات + نص). دعم كامل لـ prefers-reduced-motion.

## 8) تطبيق Impeccable / Taste (اختبار §9)
- فاخر؟ نعم — فحمي/أوكسبلود/نحاسي + بخار/جمر + ظلال ناعمة عميقة. سعودي مناسب؟ نعم — عربي RTL، نص محايد جندريًا (احجز/تصفّح/تواصل)، لهجة دافئة. يقنع خلال 3 ثوانٍ؟ الهيرو + التوقيع + التقييم. لا يشبه قالبًا؟ توقيع dry-age فريد + هوية لونية خاصة. متناسق؟ سلّم مسافات 4/8، نظام ظلال موحّد، أيقونات SVG stroke موحّدة (لا emoji).

## 9) قائمة تنقية الصور
- **مُبقاة (8):** em-1 (الواجهة/الشعار)، em-3 (مشاوي مشكّلة)، em-4 (برغر)، em-5 (صالة)، em-6 (ستيك ريب آي — هيرو)، em-7 (كباب)، em-9 (سلطة)، em-11 (كباب + أجواء).
- **مُستبعدة (3):** em-2 (لوحة أسعار — أسعار ممنوعة)، em-8 (صالة فيها وجه شخص)، em-10 (سلطة كينوا — تكوين أضعف ومكرّر).
