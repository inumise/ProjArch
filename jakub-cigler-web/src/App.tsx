import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, Mail, Phone, Award, Building2, Users, Calendar, Play, Globe, ArrowRight, Leaf, TreePine } from 'lucide-react';

const translations = {
  cs: {
    nav: { profile: 'Profil', projects: 'Projekty', awards: 'Ocenění', videos: 'Videa', contact: 'Kontakt' },
    hero: { subtitle: 'Architektonické studio', tagline: 'Progresivní architektura od roku 2001', cta: 'Prozkoumat projekty' },
    about: { title: 'O nás', description: 'Jakub Cigler Architekti (JCA) je architektonické studio, které zahájilo svou činnost v listopadu 2001 v Praze.', description2: 'Studio získalo za svou práci řadu ocenění doma i v zahraničí.', founded: 'Založeno', team: 'Členů týmu', projects: 'Realizovaných projektů', awards: 'Získaných ocenění' },
    projects: { title: 'Vybrané projekty', completed: 'Dokončeno', inProgress: 'V realizaci', area: 'Plocha', client: 'Klient' },
    awards: { title: 'Ocenění', subtitle: 'Mezinárodně uznávaná kvalita' },
    videos: { title: 'Videa', subtitle: 'Podívejte se na naše projekty' },
    contact: { title: 'Kontakt', subtitle: 'Spojte se s námi', name: 'Jméno', email: 'E-mail', message: 'Zpráva', send: 'Odeslat zprávu', phone: 'Telefon', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
  },
  en: {
    nav: { profile: 'Profile', projects: 'Projects', awards: 'Awards', videos: 'Videos', contact: 'Contact' },
    hero: { subtitle: 'Architectural Studio', tagline: 'Progressive Architecture Since 2001', cta: 'Explore Projects' },
    about: { title: 'About Us', description: 'Jakub Cigler Architekti (JCA) is an architectural studio which started its activities in November 2001 in Prague.', description2: 'The studio has won several awards for its work, both at home and abroad.', founded: 'Founded', team: 'Team Members', projects: 'Completed Projects', awards: 'Awards Won' },
    projects: { title: 'Selected Projects', completed: 'Completed', inProgress: 'In Progress', area: 'Area', client: 'Client' },
    awards: { title: 'Awards', subtitle: 'Internationally Recognized Quality' },
    videos: { title: 'Videos', subtitle: 'Watch Our Projects' },
    contact: { title: 'Contact', subtitle: 'Get in Touch', name: 'Name', email: 'Email', message: 'Message', send: 'Send Message', phone: 'Phone', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
  },
  zh: {
    nav: { profile: '简介', projects: '项目', awards: '奖项', videos: '视频', contact: '联系' },
    hero: { subtitle: '建筑设计工作室', tagline: '自2001年以来的前沿建筑设计', cta: '探索项目' },
    about: { title: '关于我们', description: 'JCA是一家建筑设计工作室，于2001年11月在布拉格开始运营。', description2: '工作室在国内外获得了多项大奖。', founded: '成立于', team: '团队成员', projects: '完成项目', awards: '获得奖项' },
    projects: { title: '精选项目', completed: '已完成', inProgress: '进行中', area: '面积', client: '客户' },
    awards: { title: '奖项', subtitle: '国际认可的品质' },
    videos: { title: '视频', subtitle: '观看我们的项目' },
    contact: { title: '联系我们', subtitle: '与我们取得联系', name: '姓名', email: '电子邮件', message: '留言', send: '发送消息', phone: '电话', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
  },
  ar: {
    nav: { profile: 'الملف', projects: 'المشاريع', awards: 'الجوائز', videos: 'الفيديو', contact: 'اتصل' },
    hero: { subtitle: 'استوديو معماري', tagline: 'هندسة معمارية متقدمة منذ 2001', cta: 'استكشف المشاريع' },
    about: { title: 'من نحن', description: 'استوديو معماري بدأ نشاطه في نوفمبر 2001 في براغ.', description2: 'حصل الاستوديو على العديد من الجوائز.', founded: 'تأسس', team: 'أعضاء الفريق', projects: 'المشاريع المنجزة', awards: 'الجوائز' },
    projects: { title: 'مشاريع مختارة', completed: 'مكتمل', inProgress: 'قيد التنفيذ', area: 'المساحة', client: 'العميل' },
    awards: { title: 'الجوائز', subtitle: 'جودة معترف بها دوليا' },
    videos: { title: 'الفيديوهات', subtitle: 'شاهد مشاريعنا' },
    contact: { title: 'اتصل بنا', subtitle: 'تواصل معنا', name: 'الاسم', email: 'البريد', message: 'الرسالة', send: 'إرسال', phone: 'الهاتف', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
  },
};

type Language = 'cs' | 'en' | 'zh' | 'ar';
type TranslationType = typeof translations.cs;
const LanguageContext = createContext<{ lang: Language; setLang: (lang: Language) => void; t: TranslationType; isRTL: boolean }>({ lang: 'cs', setLang: () => {}, t: translations.cs, isRTL: false });
const useLanguage = () => useContext(LanguageContext);

const projects = [
  { id: 1, name: 'Victoria Palace', description: 'Budova Victoria Palace je po téměř 90 letech první novostavbou na Vítězném náměstí.', descriptionEn: 'The Victoria Palace building is the first new building in almost 90 years on Victory Square.', year: '2024', status: 'completed', area: '12,390 m²', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=95' },
  { id: 2, name: 'Florentinum', description: 'Multifunkční administrativní komplex v centru Prahy.', descriptionEn: 'Multifunction administrative complex in Prague center.', year: '2013', status: 'completed', area: '126,000 m²', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=95' },
  { id: 3, name: 'Quadrio', description: 'Rezidenční budova v historickém centru Prahy.', descriptionEn: 'Residential building in the historic center of Prague.', year: '2014', status: 'completed', area: '45,000 m²', client: 'CPI Property Group', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=95' },
  { id: 4, name: 'Churchill I.', description: 'Administrativní budova na náměstí W. Churchilla.', descriptionEn: 'Administrative building on W. Churchill square.', year: '2019', status: 'completed', area: '33,100 m²', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1920&q=95' },
  { id: 5, name: 'Dynamica', description: 'Moderní administrativní budova.', descriptionEn: 'Modern administrative building.', year: '2018', status: 'completed', area: '25,000 m²', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=95' },
  { id: 6, name: 'Aviatica', description: 'Kancelářská budova certifikovaná LEED Gold.', descriptionEn: 'Office building certified LEED Gold.', year: '2015', status: 'completed', area: '27,000 m²', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1920&q=95' },
  { id: 7, name: 'Masarykovo nádraží', description: 'Modernizace historického nádraží se Zaha Hadid Architects.', descriptionEn: 'Modernization of historic station with Zaha Hadid Architects.', year: '2025', status: 'in_progress', area: '150,000 m²', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=95' },
  { id: 8, name: 'The Park', description: 'Víceúčelový komplex v Chodově.', descriptionEn: 'Multipurpose complex in Chodov.', year: '2011', status: 'completed', area: '190,000 m²', client: 'AIG/Lincoln', image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1920&q=95' },
];

const awards = [
  { year: '2019', title: 'Best of Realty - 2. cena', project: 'Churchill I.' },
  { year: '2019', title: 'WELL Core & Shell Certification', project: 'Visionary' },
  { year: '2016', title: 'Building of the Year CEEQA', project: 'Aviatica' },
  { year: '2015', title: 'Best Office Development', project: 'Aviatica' },
  { year: '2014', title: 'Best of Realty - 1. cena', project: 'Quadrio' },
  { year: '2013', title: 'Best Office Development', project: 'Florentinum' },
  { year: '2012', title: 'International Design Awards', project: 'Sofia Airport' },
  { year: '2009', title: 'Cena Dušana Jurkoviče', project: 'Digital Park' },
];

const videos = [
  { id: 1, title: 'Prague Architecture Walk', thumbnail: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1280&q=90', embedUrl: 'https://www.youtube.com/embed/I24qiVmY6Uk', description: 'Architektonická procházka Prahou' },
  { id: 2, title: 'Masaryčka by Zaha Hadid', thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&q=90', embedUrl: 'https://www.youtube.com/embed/I24qiVmY6Uk?start=2481', description: 'Masaryčka od Zaha Hadid Architects' },
  { id: 3, title: 'Prague Hidden Secrets', thumbnail: 'https://images.unsplash.com/photo-1458150945447-7fb764c11a92?w=1280&q=90', embedUrl: 'https://www.youtube.com/embed/PvlDc_epoUU', description: 'Skryté tajemství Prahy' },
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

function useParallax() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollY;
}

function AnimatedCounter({ end, duration = 800, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(end);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, isInView } = useInView();
  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);
    setCount(0);
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration, hasAnimated]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function TiltCard3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform(`perspective(1000px) rotateX(${(y - 0.5) * -15}deg) rotateY(${(x - 0.5) * 15}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: x * 100, y: y * 100 });
  }, []);
  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50 });
  }, []);
  return (
    <div ref={cardRef} className={`relative transition-all duration-500 ease-out ${className}`} style={{ transform, transformStyle: 'preserve-3d' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
      <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.2) 0%, transparent 60%)` }} />
    </div>
  );
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(onComplete, 500); return 100; }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=1920&q=90" alt="Living wall" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-emerald-950/90" />
      </div>
      <div className="relative z-10 text-center">
        <div className="mb-8 relative">
          <Leaf className="w-20 h-20 text-emerald-400 mx-auto animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-24 h-24 border-2 border-emerald-400/30 rounded-full animate-ping" /></div>
        </div>
        <h1 className="text-4xl font-light text-white mb-2 tracking-widest">JAKUB CIGLER</h1>
        <p className="text-emerald-400 text-sm tracking-widest mb-8">ARCHITEKTI</p>
        <div className="w-64 h-1 bg-emerald-900 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-emerald-500/60 text-xs mt-4 tracking-widest">{progress}%</p>
      </div>
    </div>
  );
}

function Navigation() {
  const { t, lang, setLang, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-emerald-950/95 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><Leaf className="w-8 h-8 text-emerald-400" /><span className="text-white font-light text-xl tracking-widest">JCA</span></div>
        <div className="hidden md:flex items-center gap-8">
          {Object.entries(t.nav).map(([key, value]) => (<button key={key} onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })} className="text-white/70 hover:text-emerald-400 transition-colors text-sm tracking-wider uppercase">{value}</button>))}
        </div>
        <div className="flex items-center gap-2">
          {(['cs', 'en', 'zh', 'ar'] as Language[]).map(l => (<button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-xs rounded transition-all ${lang === l ? 'bg-emerald-500 text-white' : 'text-white/50 hover:text-white'}`}>{l.toUpperCase()}</button>))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const { t, isRTL } = useLanguage();
  const scrollY = useParallax();
  return (
    <section id="profile" className="relative h-screen overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=95" alt="Modern green architecture" className="w-full h-full object-cover" style={{ transform: `scale(1.1) translateY(${scrollY * 0.2}px)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/40 to-emerald-950/90" />
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=90" alt="Architecture" className="absolute top-20 right-10 w-64 h-40 object-cover rounded-lg shadow-2xl opacity-60" style={{ transform: `translateY(${scrollY * 0.3}px) rotate(3deg)` }} />
        <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=90" alt="Architecture" className="absolute bottom-40 left-10 w-48 h-32 object-cover rounded-lg shadow-2xl opacity-50" style={{ transform: `translateY(${scrollY * -0.2}px) rotate(-2deg)` }} />
      </div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="mb-6"><Leaf className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse" /></div>
        <h1 className="text-6xl md:text-8xl font-extralight text-white mb-4 tracking-widest">JAKUB CIGLER</h1>
        <p className="text-emerald-400 text-xl md:text-2xl tracking-widest mb-2">ARCHITEKTI</p>
        <p className="text-white/60 text-lg mb-12 max-w-2xl">{t.hero.tagline}</p>
        <Button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-500/30">{t.hero.cta}<ArrowRight className="ml-2 w-5 h-5" /></Button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown className="w-8 h-8 text-emerald-400" /></div>
      <div className="absolute left-0 top-0 bottom-0 w-20 overflow-hidden"><img src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=400&q=90" alt="Living wall" className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-950" /></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 overflow-hidden"><img src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=400&q=90" alt="Living wall" className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-950" /></div>
    </section>
  );
}

function AboutSection() {
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  const stats = [{ icon: Calendar, value: 2001, label: t.about.founded }, { icon: Users, value: 50, suffix: '+', label: t.about.team }, { icon: Building2, value: 8, label: t.about.projects }, { icon: Award, value: 8, label: t.about.awards }];
  return (
    <section className="relative py-32 overflow-hidden bg-emerald-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=90" alt="Modern office" className="w-full h-full object-cover opacity-10" /></div>
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`relative transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=95" alt="JCA Office" className="w-full h-96 object-cover rounded-2xl shadow-2xl" />
              <div className="absolute -top-4 -left-4 -right-4 h-8 overflow-hidden rounded-t-2xl"><img src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=90" alt="Plants" className="w-full h-full object-cover" /></div>
              <div className="absolute -bottom-4 -left-4 -right-4 h-8 overflow-hidden rounded-b-2xl"><img src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=90" alt="Plants" className="w-full h-full object-cover" /></div>
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-center gap-3 mb-6"><TreePine className="w-8 h-8 text-emerald-400" /><h2 className="text-4xl font-light text-white tracking-wide">{t.about.title}</h2></div>
            <p className="text-white/70 text-lg leading-relaxed mb-4">{t.about.description}</p>
            <p className="text-white/70 text-lg leading-relaxed mb-8">{t.about.description2}</p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (<div key={i} className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-800/50"><stat.icon className="w-6 h-6 text-emerald-400 mb-3" /><div className="text-3xl font-light text-white mb-1"><AnimatedCounter end={stat.value} suffix={stat.suffix || ''} /></div><div className="text-emerald-400/70 text-sm">{stat.label}</div></div>))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { t, lang, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  return (
    <section id="projects" className="relative py-32 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 left-0 w-40 h-80 overflow-hidden opacity-40"><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=90" alt="Plants" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-950" /></div>
      <div className="absolute top-0 right-0 w-40 h-80 overflow-hidden opacity-40"><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=90" alt="Plants" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-950" /></div>
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16"><Leaf className="w-10 h-10 text-emerald-400 mx-auto mb-4" /><h2 className="text-4xl font-light text-white tracking-wide mb-4">{t.projects.title}</h2><div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" /></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <Dialog key={project.id}>
              <DialogTrigger asChild>
                <div className={`group cursor-pointer transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <TiltCard3D className="group">
                    <Card className="overflow-hidden bg-emerald-900/50 border-emerald-800/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4"><span className={`inline-block px-3 py-1 rounded-full text-xs ${project.status === 'completed' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'}`}>{project.status === 'completed' ? t.projects.completed : t.projects.inProgress} {project.year}</span></div>
                      </div>
                      <CardContent className="p-6"><h3 className="text-xl font-medium text-white mb-2">{project.name}</h3><p className="text-white/60 text-sm line-clamp-2">{lang === 'en' ? project.descriptionEn : project.description}</p></CardContent>
                    </Card>
                  </TiltCard3D>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-emerald-950 border-emerald-800">
                <DialogHeader><DialogTitle className="text-2xl text-white">{project.name}</DialogTitle></DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <img src={project.image} alt={project.name} className="w-full h-64 object-cover rounded-lg" />
                  <div><p className="text-white/70 mb-4">{lang === 'en' ? project.descriptionEn : project.description}</p><div className="space-y-2 text-sm"><div className="flex justify-between text-white/60"><span>{t.projects.area}:</span><span className="text-emerald-400">{project.area}</span></div><div className="flex justify-between text-white/60"><span>{t.projects.client}:</span><span className="text-emerald-400">{project.client}</span></div></div></div>
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
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  return (
    <section id="awards" className="relative py-32 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=95" alt="Green architecture" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-emerald-950/90" /></div>
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16"><Award className="w-10 h-10 text-emerald-400 mx-auto mb-4" /><h2 className="text-4xl font-light text-white tracking-wide mb-2">{t.awards.title}</h2><p className="text-emerald-400/70">{t.awards.subtitle}</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, i) => (<div key={i} className={`bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-800/50 hover:border-emerald-500/50 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 100}ms` }}><div className="text-emerald-400 text-sm mb-2">{award.year}</div><h3 className="text-white font-medium mb-2">{award.title}</h3><p className="text-white/50 text-sm">{award.project}</p></div>))}
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  return (
    <section id="videos" className="relative py-32 bg-emerald-950" dir={isRTL ? 'rtl' : 'ltr'}>
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16"><Play className="w-10 h-10 text-emerald-400 mx-auto mb-4" /><h2 className="text-4xl font-light text-white tracking-wide mb-2">{t.videos.title}</h2><p className="text-emerald-400/70">{t.videos.subtitle}</p></div>
        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video, i) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <div className={`group cursor-pointer transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4"><img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-emerald-950/50 flex items-center justify-center group-hover:bg-emerald-950/30 transition-colors"><div className="w-16 h-16 rounded-full bg-emerald-500/80 flex items-center justify-center group-hover:scale-110 transition-transform"><Play className="w-8 h-8 text-white ml-1" /></div></div></div>
                  <h3 className="text-white font-medium">{video.title}</h3><p className="text-white/50 text-sm">{video.description}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-emerald-950 border-emerald-800"><DialogHeader><DialogTitle className="text-white">{video.title}</DialogTitle></DialogHeader><div className="aspect-video"><iframe src={video.embedUrl} className="w-full h-full rounded-lg" allowFullScreen /></div></DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log('Form submitted:', formData); setFormData({ name: '', email: '', message: '' }); };
  return (
    <section id="contact" className="relative py-32 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=1920&q=95" alt="Living wall" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-emerald-950/85" /></div>
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-center gap-3 mb-6"><Mail className="w-8 h-8 text-emerald-400" /><h2 className="text-4xl font-light text-white tracking-wide">{t.contact.title}</h2></div>
            <p className="text-white/70 text-lg mb-8">{t.contact.subtitle}</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"><Building2 className="w-6 h-6 text-emerald-400" /></div><div><p className="text-white font-medium">{t.contact.company}</p><p className="text-white/60 text-sm">Nad Ostrovem 1119/7, 147 00 Praha 4</p></div></div>
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"><Phone className="w-6 h-6 text-emerald-400" /></div><div><p className="text-white font-medium">{t.contact.phone}</p><p className="text-white/60 text-sm">+420-2-2680 5329</p></div></div>
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"><Mail className="w-6 h-6 text-emerald-400" /></div><div><p className="text-white font-medium">Email</p><p className="text-white/60 text-sm">info@jakubcigler.archi</p></div></div>
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"><Globe className="w-6 h-6 text-emerald-400" /></div><div><p className="text-white font-medium">Web</p><p className="text-white/60 text-sm">www.jakubcigler.archi</p></div></div>
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <TiltCard3D>
              <form onSubmit={handleSubmit} className="bg-emerald-900/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-800/50">
                <div className="space-y-6">
                  <div><label className="block text-white/70 text-sm mb-2">{t.contact.name}</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-emerald-950/50 border-emerald-700 text-white placeholder:text-white/30 focus:border-emerald-500" placeholder={t.contact.name} /></div>
                  <div><label className="block text-white/70 text-sm mb-2">{t.contact.email}</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-emerald-950/50 border-emerald-700 text-white placeholder:text-white/30 focus:border-emerald-500" placeholder={t.contact.email} /></div>
                  <div><label className="block text-white/70 text-sm mb-2">{t.contact.message}</label><Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="bg-emerald-950/50 border-emerald-700 text-white placeholder:text-white/30 focus:border-emerald-500 min-h-32" placeholder={t.contact.message} /></div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-6 rounded-xl transition-all duration-300 hover:scale-105">{t.contact.send}<ArrowRight className="ml-2 w-5 h-5" /></Button>
                </div>
              </form>
            </TiltCard3D>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-12 bg-emerald-950 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3"><Leaf className="w-6 h-6 text-emerald-400" /><span className="text-white/70 text-sm">JAKUB CIGLER ARCHITEKTI, a.s.</span></div>
          <p className="text-white/50 text-sm">© 2001-2026 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [lang, setLang] = useState<Language>('cs');
  const [loading, setLoading] = useState(true);
  const t = translations[lang];
  const isRTL = lang === 'ar';
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div className={`min-h-screen bg-emerald-950 ${isRTL ? 'rtl' : 'ltr'}`}>
        {loading ? (<LoadingScreen onComplete={() => setLoading(false)} />) : (<><Navigation /><HeroSection /><AboutSection /><ProjectsSection /><AwardsSection /><VideosSection /><ContactSection /><Footer /></>)}
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
