import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, Mail, Phone, Award, Building2, Users, Calendar, Play, Globe, ArrowRight } from 'lucide-react';

const translations = {
  cs: {
    nav: { profile: 'Profil', projects: 'Projekty', awards: 'Oceneni', videos: 'Videa', contact: 'Kontakt' },
    hero: { subtitle: 'Architektonicke studio', tagline: 'Progresivni architektura od roku 2001', cta: 'Prozkoumat projekty' },
    about: { title: 'O nas', description: 'Jakub Cigler Architekti (JCA) je architektonicke studio, ktere zahajilo svou cinnost v listopadu 2001 v Praze.', description2: 'Studio ziskalo za svou praci radu oceneni doma i v zahranici.', founded: 'Zalozeno', team: 'Clenu tymu', projects: 'Realizovanych projektu', awards: 'Ziskanych oceneni' },
    projects: { title: 'Vybrane projekty', completed: 'Dokonceno', inProgress: 'V realizaci', area: 'Plocha', client: 'Klient', more: 'Vice informaci' },
    awards: { title: 'Oceneni', subtitle: 'Mezinarodne uznavana kvalita' },
    videos: { title: 'Videa', subtitle: 'Podivejte se na nase projekty' },
    contact: { title: 'Kontakt', subtitle: 'Spojte se s nami', name: 'Jmeno', email: 'E-mail', message: 'Zprava', send: 'Odeslat zpravu', phone: 'Telefon', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
    footer: { rights: 'Vsechna prava vyhrazena', privacy: 'Ochrana osobnich udaju' },
    floor: 'Patro',
  },
  en: {
    nav: { profile: 'Profile', projects: 'Projects', awards: 'Awards', videos: 'Videos', contact: 'Contact' },
    hero: { subtitle: 'Architectural Studio', tagline: 'Progressive Architecture Since 2001', cta: 'Explore Projects' },
    about: { title: 'About Us', description: 'Jakub Cigler Architekti (JCA) is an architectural studio which started its activities in November 2001 in Prague.', description2: 'The studio has won several awards for its work, both at home and abroad.', founded: 'Founded', team: 'Team Members', projects: 'Completed Projects', awards: 'Awards Won' },
    projects: { title: 'Selected Projects', completed: 'Completed', inProgress: 'In Progress', area: 'Area', client: 'Client', more: 'More Information' },
    awards: { title: 'Awards', subtitle: 'Internationally Recognized Quality' },
    videos: { title: 'Videos', subtitle: 'Watch Our Projects' },
    contact: { title: 'Contact', subtitle: 'Get in Touch', name: 'Name', email: 'Email', message: 'Message', send: 'Send Message', phone: 'Phone', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
    footer: { rights: 'All Rights Reserved', privacy: 'Privacy Policy' },
    floor: 'Floor',
  },
  zh: {
    nav: { profile: '简介', projects: '项目', awards: '奖项', videos: '视频', contact: '联系' },
    hero: { subtitle: '建筑设计工作室', tagline: '自2001年以来的前沿建筑设计', cta: '探索项目' },
    about: { title: '关于我们', description: 'JCA是一家建筑设计工作室，于2001年11月在布拉格开始运营。', description2: '工作室在国内外获得了多项大奖。', founded: '成立于', team: '团队成员', projects: '完成项目', awards: '获得奖项' },
    projects: { title: '精选项目', completed: '已完成', inProgress: '进行中', area: '面积', client: '客户', more: '更多信息' },
    awards: { title: '奖项', subtitle: '国际认可的品质' },
    videos: { title: '视频', subtitle: '观看我们的项目' },
    contact: { title: '联系我们', subtitle: '与我们取得联系', name: '姓名', email: '电子邮件', message: '留言', send: '发送消息', phone: '电话', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
    footer: { rights: '版权所有', privacy: '隐私政策' },
    floor: '楼层',
  },
  ar: {
    nav: { profile: 'الملف', projects: 'المشاريع', awards: 'الجوائز', videos: 'الفيديو', contact: 'اتصل' },
    hero: { subtitle: 'استوديو معماري', tagline: 'هندسة معمارية متقدمة منذ 2001', cta: 'استكشف المشاريع' },
    about: { title: 'من نحن', description: 'استوديو معماري بدأ نشاطه في نوفمبر 2001 في براغ.', description2: 'حصل الاستوديو على العديد من الجوائز.', founded: 'تأسس', team: 'أعضاء الفريق', projects: 'المشاريع المنجزة', awards: 'الجوائز' },
    projects: { title: 'مشاريع مختارة', completed: 'مكتمل', inProgress: 'قيد التنفيذ', area: 'المساحة', client: 'العميل', more: 'المزيد' },
    awards: { title: 'الجوائز', subtitle: 'جودة معترف بها دوليا' },
    videos: { title: 'الفيديوهات', subtitle: 'شاهد مشاريعنا' },
    contact: { title: 'اتصل بنا', subtitle: 'تواصل معنا', name: 'الاسم', email: 'البريد', message: 'الرسالة', send: 'إرسال', phone: 'الهاتف', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
    footer: { rights: 'جميع الحقوق محفوظة', privacy: 'سياسة الخصوصية' },
    floor: 'طابق',
  },
};

type Language = 'cs' | 'en' | 'zh' | 'ar';
type TranslationType = typeof translations.cs;
const LanguageContext = createContext<{ lang: Language; setLang: (lang: Language) => void; t: TranslationType; isRTL: boolean }>({ lang: 'cs', setLang: () => {}, t: translations.cs, isRTL: false });
const useLanguage = () => useContext(LanguageContext);

const projects = [
  { id: 1, name: 'Victoria Palace', nameEn: 'Victoria Palace', description: 'Budova Victoria Palace je po temer 90 letech prvni novostavbou na Viteznem namesti.', descriptionEn: 'The Victoria Palace building is the first new building in almost 90 years on Victory Square.', year: '2024', status: 'completed', area: '12,390 m2', client: 'Penta Real Estate', image: 'https://jakubcigler.archi/sites/default/files/styles/jc_xxl_9/public/jakub_cigler_architects_penta_victoria_palace_boysplaynice_14_0.jpg', category: 'administrative' },
  { id: 2, name: 'Florentinum', nameEn: 'Florentinum', description: 'Multifunkcni administrativni komplex.', descriptionEn: 'Multifunction administrative complex.', year: '2013', status: 'completed', area: '126,000 m2', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800', category: 'administrative' },
  { id: 3, name: 'Quadrio', nameEn: 'Quadrio', description: 'Rezidencni budova v historickem centru Prahy.', descriptionEn: 'Residential building in the historic center of Prague.', year: '2014', status: 'completed', area: '45,000 m2', client: 'CPI Property Group', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', category: 'mixed' },
  { id: 4, name: 'Churchill I.', nameEn: 'Churchill I.', description: 'Administrativni budova na namesti W. Churchilla.', descriptionEn: 'Administrative building on W. Churchill square.', year: '2019', status: 'completed', area: '33,100 m2', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800', category: 'administrative' },
  { id: 5, name: 'Dynamica', nameEn: 'Dynamica', description: 'Moderni administrativni budova.', descriptionEn: 'Modern administrative building.', year: '2018', status: 'completed', area: '25,000 m2', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', category: 'administrative' },
  { id: 6, name: 'Aviatica', nameEn: 'Aviatica', description: 'Kancelarska budova certifikovana LEED Gold.', descriptionEn: 'Office building certified LEED Gold.', year: '2015', status: 'completed', area: '27,000 m2', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', category: 'administrative' },
  { id: 7, name: 'Masarykovo nadrazi', nameEn: 'Masaryk Railway Station', description: 'Modernizace historickeho nadrazi se Zaha Hadid Architects.', descriptionEn: 'Modernization of historic station with Zaha Hadid Architects.', year: '2025', status: 'in_progress', area: '150,000 m2', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', category: 'mixed' },
  { id: 8, name: 'The Park', nameEn: 'The Park', description: 'Viceucelovy komplex v Chodove.', descriptionEn: 'Multipurpose complex in Chodov.', year: '2011', status: 'completed', area: '190,000 m2', client: 'AIG/Lincoln', image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800', category: 'mixed' },
];

const awards = [
  { year: '2019', title: 'Best of Realty - 2. cena', project: 'Churchill I.' },
  { year: '2019', title: 'WELL Core & Shell Certification', project: 'Visionary' },
  { year: '2016', title: 'Building of the Year CEEQA', project: 'Aviatica' },
  { year: '2015', title: 'Best Office Development', project: 'Aviatica' },
  { year: '2014', title: 'Best of Realty - 1. cena', project: 'Quadrio' },
  { year: '2013', title: 'Best Office Development', project: 'Florentinum' },
  { year: '2012', title: 'International Design Awards', project: 'Sofia Airport' },
  { year: '2009', title: 'Cena Dusana Jurkovice', project: 'Digital Park' },
];

const videos = [
  { id: 1, title: 'Prague Architecture Walk', thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=640', embedUrl: 'https://www.youtube.com/embed/I24qiVmY6Uk', description: 'Architektonicka prochazka Prahou' },
  { id: 2, title: 'Masarycka by Zaha Hadid', thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=640', embedUrl: 'https://www.youtube.com/embed/I24qiVmY6Uk?start=2481', description: 'Masarycka od Zaha Hadid Architects' },
  { id: 3, title: 'Prague Hidden Secrets', thumbnail: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=640', embedUrl: 'https://www.youtube.com/embed/PvlDc_epoUU', description: 'Skryte tajemstvi Prahy' },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isInView };
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();
  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function TiltCard({ children, className = '', intensity = 15 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -intensity;
    const rotateY = (x - 0.5) * intensity;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`);
  }, [intensity]);
  const handleMouseLeave = useCallback(() => { setTransform(''); }, []);
  return (
    <div ref={cardRef} className={`transition-transform duration-300 ${className}`} style={{ transform }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}

function GreekPillar({ height = 200 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center" style={{ height }}>
      <div className="w-16 h-4 bg-gradient-to-b from-stone-200 to-stone-300 rounded-t-sm shadow-inner" />
      <div className="w-20 h-2 bg-gradient-to-b from-stone-300 to-stone-400" />
      <div className="flex-1 w-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300" />
        {[0,1,2,3,4,5].map((i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-stone-400/30" style={{ left: `${(i + 1) * 14}%` }} />
        ))}
      </div>
      <div className="w-16 h-2 bg-gradient-to-b from-stone-400 to-stone-500" />
      <div className="w-20 h-3 bg-gradient-to-b from-stone-500 to-stone-600 rounded-b-sm" />
    </div>
  );
}

function BuildingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-white font-light tracking-widest text-lg">
              <span className="text-orange-400 font-semibold">JAKUB CIGLER</span> ARCHITEKTI
            </h1>
            <p className="text-white/60 text-xs tracking-wide">Progressive Architecture Since 2001 - Praha, Czech Republic</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+420226805329" className="text-orange-400/80 hover:text-orange-400 text-sm flex items-center gap-1">
              <Phone className="w-3 h-3" /> +420 226 805 329
            </a>
            <a href="mailto:info@jakubcigler.archi" className="text-orange-400/80 hover:text-orange-400 text-sm flex items-center gap-1">
              <Mail className="w-3 h-3" /> info@jakubcigler.archi
            </a>
          </div>
        </div>
      </div>

      <div className="relative flex">
        <div className="fixed left-0 top-16 bottom-0 w-12 z-40 bg-zinc-900/90 backdrop-blur-sm border-r border-orange-500/20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 92%)' }}>
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500/50 via-orange-400/30 to-transparent" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-px h-32 bg-orange-500/40" style={{ transform: 'translateX(-50%) rotate(45deg)', transformOrigin: 'top' }} />
          <nav className="absolute top-24 left-0 right-0 flex flex-col items-center gap-6">
            {['profile', 'projects', 'awards', 'videos', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="text-white/70 hover:text-orange-400 transition-colors text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {item}
              </a>
            ))}
          </nav>
          <div className="absolute bottom-32 left-2 w-5 h-16 border-2 border-stone-500 bg-gradient-to-b from-sky-300 to-sky-500 overflow-hidden">
            <div className="absolute top-2 left-1 w-2 h-1 bg-white/70 rounded-full animate-float" />
          </div>
        </div>

        <div className="fixed right-0 top-16 bottom-0 w-12 z-40 bg-zinc-900/90 backdrop-blur-sm border-l border-orange-500/20 flex flex-col items-center justify-center">
          <div className="flex flex-col gap-4">
            <a href="#contact" className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 rounded flex items-center justify-center transition-colors">
              <Mail className="w-4 h-4 text-orange-400" />
            </a>
            <a href="tel:+420226805329" className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 rounded flex items-center justify-center transition-colors">
              <Phone className="w-4 h-4 text-orange-400" />
            </a>
            <a href="https://jakubcigler.archi" target="_blank" className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 rounded flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4 text-orange-400" />
            </a>
          </div>
          <div className="absolute bottom-32 right-2 w-5 h-16 border-2 border-stone-500 bg-gradient-to-b from-sky-300 to-sky-500 overflow-hidden">
            <div className="absolute top-4 left-0 w-3 h-1 bg-white/70 rounded-full animate-floatSlow" />
          </div>
        </div>

        <main className="flex-1 ml-12 mr-12 bg-gradient-to-b from-stone-50 via-white to-stone-100 min-h-screen">
          {children}
        </main>
      </div>

      <div className="relative ml-12 mr-12 bg-gradient-to-b from-stone-100 to-stone-200 pt-8">
        <div className="flex justify-around items-end px-8 relative z-10">
          <GreekPillar height={160} />
          <GreekPillar height={180} />
          <GreekPillar height={200} />
          <GreekPillar height={200} />
          <GreekPillar height={180} />
          <GreekPillar height={160} />
        </div>
        <div className="h-20 bg-gradient-to-b from-green-600 via-green-500 to-green-700 relative overflow-hidden">
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39].map((i) => (
            <div key={i} className="absolute bottom-0 w-1 bg-gradient-to-t from-green-800 to-green-500 rounded-t-full" style={{ left: `${i * 2.5}%`, height: `${20 + (i % 5) * 5}px`, transform: `rotate(${-3 + (i % 6)}deg)` }} />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-amber-900/50 to-transparent" />
        </div>
        <div className="bg-zinc-900 py-6 px-8 text-center">
          <p className="text-white/60 text-sm">2026 JAKUB CIGLER ARCHITEKTI, a.s. - Nad Ostrovem 1119/7, 147 00 Praha 4</p>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const { lang, setLang } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langLabels: Record<Language, string> = { cs: 'CZ', en: 'EN', zh: '中文', ar: 'عربي' };

  return (
    <div className="sticky top-12 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <nav className="flex gap-8">
          {['profile', 'projects', 'awards', 'videos', 'contact'].map((item) => (
            <a key={item} href={`#${item}`} className="text-stone-600 hover:text-orange-500 text-sm tracking-wide capitalize transition-colors">
              {item}
            </a>
          ))}
        </nav>
        <div className="relative">
          <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 text-sm text-stone-600 hover:text-orange-500">
            <Globe className="w-4 h-4" /> {langLabels[lang]} <ChevronDown className="w-3 h-3" />
          </button>
          {langMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-xl py-2 min-w-20">
              {(Object.keys(langLabels) as Language[]).map((l) => (
                <button key={l} onClick={() => { setLang(l); setLangMenuOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm hover:bg-stone-50 ${lang === l ? 'text-orange-500 font-medium' : 'text-stone-500'}`}>
                  {langLabels[l]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-orange-300/30 rotate-12 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-40 border border-stone-300/40 -rotate-6 animate-floatSlow" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-orange-100/50 rotate-45 animate-float" />
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-stone-200/50 rounded-full animate-pulse" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <p className="text-orange-500 text-sm tracking-widest uppercase mb-4 animate-fadeInUp">{t.hero.subtitle}</p>
        <h1 className="text-stone-800 text-5xl md:text-7xl font-extralight tracking-tight mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          JAKUB CIGLER
          <span className="block text-3xl md:text-4xl mt-2 text-stone-500">ARCHITEKTI</span>
        </h1>
        <p className="text-stone-400 text-lg md:text-xl font-light mb-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>{t.hero.tagline}</p>
        <a href="#projects" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 text-sm tracking-wide hover:bg-orange-600 transition-all hover:gap-4 rounded-lg shadow-lg animate-fadeInUp group" style={{ animationDelay: '0.6s' }}>
          {t.hero.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
        <div className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const { t, lang } = useLanguage();
  const { ref, isInView } = useInView();
  const stats = [
    { icon: Calendar, value: 2001, label: t.about.founded, suffix: '' },
    { icon: Users, value: 50, label: t.about.team, suffix: '+' },
    { icon: Building2, value: 100, label: t.about.projects, suffix: '+' },
    { icon: Award, value: 20, label: t.about.awards, suffix: '+' },
  ];

  return (
    <section id="profile" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          <TiltCard className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative aspect-square bg-stone-100 overflow-hidden rounded-2xl shadow-2xl">
              <img src="https://jakubcigler.archi/sites/default/files/styles/jc_xxl_9/public/jakub_cigler_architects_penta_victoria_palace_boysplaynice_14_0.jpg" alt="JCA Architecture" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'; }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent" />
            </div>
          </TiltCard>
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'} ${lang === 'ar' ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-extralight text-stone-800 mb-8">{t.about.title}<span className="block w-20 h-1 bg-orange-500 mt-4 rounded-full" /></h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">{t.about.description}</p>
            <p className="text-stone-500 leading-relaxed mb-12">{t.about.description2}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <stat.icon className="w-6 h-6 mx-auto mb-3 text-orange-400 group-hover:text-orange-500 transition-colors" />
                  <div className="text-3xl font-light text-stone-800 mb-1"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                  <div className="text-xs text-stone-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { t, lang } = useLanguage();
  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`mb-16 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-extralight text-stone-800 mb-4">{t.projects.title}<span className="block w-20 h-1 bg-orange-500 mt-4 rounded-full" /></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Dialog key={project.id}>
              <DialogTrigger asChild>
                <div className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TiltCard className="cursor-pointer group">
                    <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-2xl">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className={`inline-block text-xs px-3 py-1 mb-2 rounded-full ${project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                              {project.status === 'completed' ? t.projects.completed : t.projects.inProgress} {project.year}
                            </span>
                            <h3 className="text-xl font-light text-stone-800">{lang === 'en' ? project.nameEn : project.name}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-white border-stone-200 rounded-2xl">
                <DialogHeader><DialogTitle className="text-2xl font-light text-stone-800">{lang === 'en' ? project.nameEn : project.name}</DialogTitle></DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video bg-stone-100 overflow-hidden rounded-xl">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'; }} />
                  </div>
                  <div>
                    <p className="text-stone-600 mb-6">{lang === 'en' ? project.descriptionEn : project.description}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-stone-100 pb-2"><span className="text-stone-500">{t.projects.area}</span><span className="text-stone-800">{project.area}</span></div>
                      <div className="flex justify-between border-b border-stone-100 pb-2"><span className="text-stone-500">{t.projects.client}</span><span className="text-stone-800">{project.client}</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Status</span><span className={project.status === 'completed' ? 'text-emerald-600' : 'text-orange-600'}>{project.status === 'completed' ? t.projects.completed : t.projects.inProgress}</span></div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardsSection() {
  const { t, lang } = useLanguage();
  return (
    <section id="awards" className="py-24 bg-zinc-800 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`mb-16 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-extralight text-white mb-4">{t.awards.title}<span className="block w-20 h-1 bg-orange-500 mt-4 rounded-full" /></h2>
          <p className="text-stone-400 text-lg">{t.awards.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <TiltCard key={index} intensity={10}>
              <div className="p-6 border border-zinc-700 bg-zinc-800/50 hover:border-orange-500/50 transition-all rounded-xl h-full">
                <div className="text-4xl font-extralight text-orange-400 mb-4">{award.year}</div>
                <h3 className="text-lg font-light text-white mb-2">{award.title}</h3>
                <p className="text-sm text-stone-400">{award.project}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  const { t, lang } = useLanguage();
  return (
    <section id="videos" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`mb-16 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-extralight text-stone-800 mb-4">{t.videos.title}<span className="block w-20 h-1 bg-orange-500 mt-4 rounded-full" /></h2>
          <p className="text-stone-500 text-lg">{t.videos.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <TiltCard className="cursor-pointer group">
                  <div className="relative aspect-video bg-stone-100 overflow-hidden rounded-2xl shadow-xl">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=640'; }} />
                    <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center group-hover:bg-stone-900/20 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 text-orange-500 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4"><h3 className="text-lg font-light text-stone-800">{video.title}</h3><p className="text-sm text-stone-500">{video.description}</p></div>
                </TiltCard>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-white border-stone-200 rounded-2xl overflow-hidden">
                <div className="aspect-video"><iframe src={video.embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); setFormData({ name: '', email: '', message: '' }); };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className={lang === 'ar' ? 'text-right' : ''}>
            <h2 className="text-4xl font-extralight text-stone-800 mb-4">{t.contact.title}<span className="block w-20 h-1 bg-orange-500 mt-4 rounded-full" /></h2>
            <p className="text-stone-500 text-lg mb-12">{t.contact.subtitle}</p>
            <div className="space-y-8">
              <div className="flex gap-4"><div className="w-12 h-12 bg-orange-100 flex items-center justify-center rounded-xl"><Building2 className="w-5 h-5 text-orange-500" /></div><div><h3 className="font-medium text-stone-800 mb-1">{t.contact.company}</h3><p className="text-stone-500 text-sm">Nad Ostrovem 1119/7<br />147 00 Praha 4 - Podoli<br />Ceska republika</p></div></div>
              <div className="flex gap-4"><div className="w-12 h-12 bg-orange-100 flex items-center justify-center rounded-xl"><Phone className="w-5 h-5 text-orange-500" /></div><div><h3 className="font-medium text-stone-800 mb-1">{t.contact.phone}</h3><p className="text-stone-500 text-sm">+420-2-2680 5329</p></div></div>
              <div className="flex gap-4"><div className="w-12 h-12 bg-orange-100 flex items-center justify-center rounded-xl"><Mail className="w-5 h-5 text-orange-500" /></div><div><h3 className="font-medium text-stone-800 mb-1">E-mail</h3><a href="mailto:info@jakubcigler.archi" className="text-stone-500 text-sm hover:text-orange-500 transition-colors">info@jakubcigler.archi</a></div></div>
            </div>
          </div>
          <TiltCard intensity={5}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-stone-200 rounded-2xl shadow-xl">
              <div><label className="block text-sm text-stone-600 mb-2">{t.contact.name}</label><Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-12 bg-stone-50 border-stone-200 focus:border-orange-400 rounded-xl" /></div>
              <div><label className="block text-sm text-stone-600 mb-2">{t.contact.email}</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-12 bg-stone-50 border-stone-200 focus:border-orange-400 rounded-xl" /></div>
              <div><label className="block text-sm text-stone-600 mb-2">{t.contact.message}</label><Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={6} className="bg-stone-50 border-stone-200 focus:border-orange-400 rounded-xl resize-none" /></div>
              <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium">{submitted ? 'Odeslano' : t.contact.send}</Button>
            </form>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [lang, setLang] = useState<Language>('cs');
  const [loading, setLoading] = useState(true);
  const t = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extralight text-white tracking-widest mb-4">
            <span className="text-orange-400 font-semibold">JAKUB CIGLER</span> ARCHITEKTI
          </h1>
          <div className="w-48 h-1 bg-zinc-700 mx-auto overflow-hidden rounded-full">
            <div className="h-full bg-orange-500 animate-loading-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div className={`min-h-screen ${isRTL ? 'font-arabic' : 'font-sans'}`}>
        <BuildingFrame>
          <Navigation />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <AwardsSection />
          <VideosSection />
          <ContactSection />
        </BuildingFrame>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
