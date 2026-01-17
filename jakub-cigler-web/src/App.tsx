import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, Mail, Phone, Award, Building2, Users, Calendar, Play, Globe, ArrowRight, Gem } from 'lucide-react';

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

function CubisticCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform(`perspective(1000px) rotateX(${(y - 0.5) * -6}deg) rotateY(${(x - 0.5) * 6}deg) scale3d(1.02, 1.02, 1.02)`);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  }, []);
  return (
    <div ref={cardRef} className={`relative transition-all duration-500 ease-out ${className}`} style={{ transform, transformStyle: 'preserve-3d' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}

function MarbleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'url(https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1920&q=90)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(1.1) contrast(0.95)'
      }} />
      <div className="absolute inset-0" style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(250,248,245,0.5) 50%, rgba(255,255,255,0.7) 100%)' 
      }} />
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10" style={{ 
        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        transform: 'rotate(15deg)'
      }} />
      <div className="absolute top-40 right-20 w-24 h-24 opacity-8" style={{ 
        background: 'linear-gradient(45deg, #1F2937 0%, #374151 100%)',
        clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
        transform: 'rotate(-10deg)'
      }} />
    </div>
  );
}

function CubisticShapes() {
  const scrollY = useParallax();
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 right-10 w-20 h-20" style={{ 
        transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`,
        background: 'linear-gradient(135deg, rgba(184,92,56,0.15) 0%, rgba(139,69,19,0.1) 100%)',
        boxShadow: '10px 10px 30px rgba(0,0,0,0.15)',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
      }} />
      <div className="absolute top-1/2 left-5 w-16 h-24" style={{ 
        transform: `translateY(${scrollY * -0.08}px) rotate(-5deg)`,
        background: 'linear-gradient(180deg, rgba(31,41,55,0.12) 0%, rgba(55,65,81,0.08) 100%)',
        boxShadow: '8px 8px 25px rgba(0,0,0,0.12)',
        clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)'
      }} />
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12" style={{ 
        transform: `translateY(${scrollY * 0.15}px) rotate(45deg)`,
        background: 'linear-gradient(45deg, rgba(212,165,116,0.2) 0%, rgba(184,149,110,0.15) 100%)',
        boxShadow: '6px 6px 20px rgba(0,0,0,0.1)'
      }} />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ 
      backgroundImage: 'url(https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1920&q=90)',
      backgroundSize: 'cover'
    }}>
      <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.85)' }} />
      <div className="absolute top-20 left-20 w-16 h-16 animate-pulse" style={{ 
        background: 'linear-gradient(135deg, #B85C38 0%, #8B4513 100%)',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        opacity: 0.3
      }} />
      <div className="relative z-10 text-center">
        <Gem className="w-16 h-16 mx-auto mb-8" style={{ color: '#8B4513', filter: 'drop-shadow(0 0 20px rgba(139,69,19,0.4))' }} />
        <h1 className="text-5xl font-bold tracking-wider mb-2" style={{ 
          background: 'repeating-linear-gradient(0deg, #B85C38 0px, #B85C38 8px, #8B4513 8px, #8B4513 10px)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))'
        }}>JAKUB CIGLER</h1>
        <p className="text-sm tracking-widest mb-8" style={{ color: '#8B4513' }}>ARCHITEKTI</p>
        <div className="w-48 h-2 mx-auto overflow-hidden" style={{ background: 'rgba(139,69,19,0.2)', clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)' }}>
          <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #B85C38, #8B4513, #D4A574)' }} />
        </div>
        <p className="mt-4 text-sm font-medium" style={{ color: '#6B7280' }}>{progress}%</p>
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
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`} style={{ 
      background: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent', 
      backdropFilter: scrolled ? 'blur(20px)' : 'none', 
      borderBottom: scrolled ? '2px solid rgba(139,69,19,0.2)' : 'none',
      clipPath: scrolled ? 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)' : 'none'
    }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gem className="w-8 h-8" style={{ color: '#8B4513' }} />
          <span className="text-xl font-bold tracking-wider" style={{ color: '#1F2937' }}>JCA</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[{ key: 'profile', id: 'about' }, { key: 'projects', id: 'projects' }, { key: 'awards', id: 'awards' }, { key: 'videos', id: 'videos' }, { key: 'contact', id: 'contact' }].map(item => (
            <button key={item.key} onClick={() => scrollTo(item.id)} className="text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-100 opacity-70" style={{ color: '#374151' }}>{t.nav[item.key as keyof typeof t.nav]}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {(['cs', 'en', 'zh', 'ar'] as Language[]).map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 text-xs font-medium transition-all duration-300 ${lang === l ? 'text-white' : 'opacity-60 hover:opacity-100'}`} style={{ 
              background: lang === l ? 'linear-gradient(135deg, #B85C38, #8B4513)' : 'transparent', 
              color: lang === l ? 'white' : '#374151',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const { t, isRTL } = useLanguage();
  const scrollY = useParallax();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1920&q=95" alt="Marble texture" className="w-full h-full object-cover" style={{ transform: `translateY(${scrollY * 0.2}px)`, filter: 'brightness(1.1)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(250,248,245,0.7) 50%, rgba(255,255,255,0.8) 100%)' }} />
      </div>
      <CubisticShapes />
      <div className="absolute top-24 left-8 w-28 h-28 opacity-30" style={{ transform: `translateY(${scrollY * 0.15}px) rotate(-5deg)` }}>
        <img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400&q=90" alt="" className="w-full h-full object-cover" style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)', boxShadow: '10px 10px 30px rgba(0,0,0,0.2)' }} />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <Gem className="w-14 h-14 mx-auto mb-6" style={{ color: '#8B4513', filter: 'drop-shadow(0 4px 8px rgba(139,69,19,0.3))' }} />
        <h1 className="text-6xl md:text-8xl font-black tracking-wider mb-4" style={{
          background: 'repeating-linear-gradient(0deg, #B85C38 0px, #B85C38 6px, #8B4513 6px, #8B4513 8px, #A0522D 8px, #A0522D 14px, #654321 14px, #654321 16px)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(4px 4px 0 rgba(101,67,33,0.4)) drop-shadow(8px 8px 15px rgba(0,0,0,0.3))',
          letterSpacing: '0.1em'
        }}>JAKUB CIGLER</h1>
        <p className="text-lg tracking-widest mb-2 font-semibold" style={{ color: '#8B4513' }}>{t.hero.subtitle.toUpperCase()}</p>
        <p className="text-lg mb-12 font-light" style={{ color: '#6B7280' }}>{t.hero.tagline}</p>
        <Button onClick={() => scrollTo('projects')} className="group px-8 py-6 text-white font-medium transition-all duration-500 hover:scale-105" style={{ 
          background: 'linear-gradient(135deg, #B85C38, #8B4513)',
          boxShadow: '0 15px 35px -10px rgba(139,69,19,0.4), 8px 8px 0 rgba(101,67,33,0.3)',
          clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
        }}>
          {t.hero.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8" style={{ color: '#8B4513' }} />
      </div>
    </section>
  );
}

function AboutSection() {
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  const stats = [{ icon: Calendar, value: 2001, label: t.about.founded }, { icon: Users, value: 50, suffix: '+', label: t.about.team }, { icon: Building2, value: 8, label: t.about.projects }, { icon: Award, value: 8, label: t.about.awards }];
  return (
    <section id="about" className="relative py-32 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <MarbleBackground />
      <CubisticShapes />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`relative transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="absolute -inset-4" style={{ background: 'linear-gradient(135deg, rgba(184,92,56,0.2), rgba(139,69,19,0.1))', clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)', filter: 'blur(2px)' }} />
            <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=95" alt="JCA Office" className="relative w-full h-96 object-cover" style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)', boxShadow: '15px 15px 0 rgba(139,69,19,0.2), 25px 25px 50px rgba(0,0,0,0.15)' }} />
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Gem className="w-8 h-8" style={{ color: '#8B4513' }} />
              <h2 className="text-4xl font-bold tracking-wide" style={{ color: '#1F2937' }}>{t.about.title}</h2>
            </div>
            <p className="text-lg leading-relaxed mb-4" style={{ color: '#6B7280' }}>{t.about.description}</p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B7280' }}>{t.about.description2}</p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <CubisticCard key={i}>
                  <div className="p-6 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '2px solid rgba(139,69,19,0.2)', clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)', boxShadow: '8px 8px 0 rgba(139,69,19,0.1)' }}>
                    <stat.icon className="w-6 h-6 mb-3" style={{ color: '#8B4513' }} />
                    <div className="text-3xl font-bold mb-1" style={{ color: '#1F2937' }}><AnimatedCounter end={stat.value} suffix={stat.suffix || ''} /></div>
                    <div className="text-sm font-medium" style={{ color: '#9CA3AF' }}>{stat.label}</div>
                  </div>
                </CubisticCard>
              ))}
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
    <section id="projects" className="relative py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <MarbleBackground />
      <CubisticShapes />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Gem className="w-10 h-10 mx-auto mb-4" style={{ color: '#8B4513' }} />
          <h2 className="text-4xl font-bold tracking-wide mb-4" style={{ color: '#1F2937' }}>{t.projects.title}</h2>
          <div className="w-32 h-2 mx-auto" style={{ background: 'linear-gradient(90deg, #B85C38, #8B4513, #D4A574)', clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }} />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <Dialog key={project.id}>
              <DialogTrigger asChild>
                <div className={`group cursor-pointer transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <CubisticCard className="group">
                    <Card className="overflow-hidden border-0" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', clipPath: 'polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)', boxShadow: '10px 10px 0 rgba(139,69,19,0.15), 20px 20px 40px rgba(0,0,0,0.1)' }}>
                      <div className="relative h-64 overflow-hidden">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 50%)' }} />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-block px-4 py-1 text-xs font-medium text-white" style={{ background: project.status === 'completed' ? 'linear-gradient(135deg, #8B4513, #654321)' : 'linear-gradient(135deg, #B85C38, #A0522D)', clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' }}>{project.status === 'completed' ? t.projects.completed : t.projects.inProgress} {project.year}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#1F2937' }}>{project.name}</h3>
                        <p className="text-sm line-clamp-2" style={{ color: '#6B7280' }}>{lang === 'en' ? project.descriptionEn : project.description}</p>
                      </CardContent>
                    </Card>
                  </CubisticCard>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl border-0" style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)' }}>
                <DialogHeader><DialogTitle className="text-2xl font-bold" style={{ color: '#1F2937' }}>{project.name}</DialogTitle></DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <img src={project.image} alt={project.name} className="w-full h-64 object-cover" style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)' }} />
                  <div>
                    <p className="mb-4" style={{ color: '#6B7280' }}>{lang === 'en' ? project.descriptionEn : project.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2" style={{ background: 'rgba(139,69,19,0.05)' }}><span style={{ color: '#9CA3AF' }}>{t.projects.area}:</span><span style={{ color: '#8B4513', fontWeight: 600 }}>{project.area}</span></div>
                      <div className="flex justify-between p-2" style={{ background: 'rgba(139,69,19,0.05)' }}><span style={{ color: '#9CA3AF' }}>{t.projects.client}:</span><span style={{ color: '#8B4513', fontWeight: 600 }}>{project.client}</span></div>
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
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  return (
    <section id="awards" className="relative py-32 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <MarbleBackground />
      <CubisticShapes />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Award className="w-10 h-10 mx-auto mb-4" style={{ color: '#8B4513' }} />
          <h2 className="text-4xl font-bold tracking-wide mb-2" style={{ color: '#1F2937' }}>{t.awards.title}</h2>
          <p className="font-medium" style={{ color: '#8B4513' }}>{t.awards.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, i) => (
            <CubisticCard key={i}>
              <div className={`p-6 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 100}ms`, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: '2px solid rgba(139,69,19,0.15)', clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)', boxShadow: '6px 6px 0 rgba(139,69,19,0.1)' }}>
                <div className="text-sm font-bold mb-2" style={{ color: '#8B4513' }}>{award.year}</div>
                <h3 className="font-semibold mb-2" style={{ color: '#1F2937' }}>{award.title}</h3>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>{award.project}</p>
              </div>
            </CubisticCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  const { t, isRTL } = useLanguage();
  const { ref, isInView } = useInView();
  return (
    <section id="videos" className="relative py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <MarbleBackground />
      <CubisticShapes />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Play className="w-10 h-10 mx-auto mb-4" style={{ color: '#8B4513' }} />
          <h2 className="text-4xl font-bold tracking-wide mb-2" style={{ color: '#1F2937' }}>{t.videos.title}</h2>
          <p className="font-medium" style={{ color: '#8B4513' }}>{t.videos.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video, i) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <div className={`group cursor-pointer transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="relative h-48 overflow-hidden mb-4" style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)', boxShadow: '10px 10px 0 rgba(139,69,19,0.15), 20px 20px 40px rgba(0,0,0,0.1)' }}>
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(2px)' }}>
                      <div className="w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #B85C38, #8B4513)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', boxShadow: '0 10px 30px -10px rgba(139,69,19,0.5)' }}>
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: '#1F2937' }}>{video.title}</h3>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>{video.description}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 border-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', clipPath: 'polygon(1% 0%, 99% 0%, 100% 100%, 0% 100%)' }}>
                <div className="aspect-video"><iframe src={video.embedUrl} className="w-full h-full" allowFullScreen /></div>
              </DialogContent>
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
  return (
    <section id="contact" className="relative py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <MarbleBackground />
      <CubisticShapes />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-8 h-8" style={{ color: '#8B4513' }} />
              <h2 className="text-4xl font-bold tracking-wide" style={{ color: '#1F2937' }}>{t.contact.title}</h2>
            </div>
            <p className="text-lg mb-8 font-medium" style={{ color: '#8B4513' }}>{t.contact.subtitle}</p>
            <div className="space-y-4">
              {[
                { icon: Building2, title: t.contact.company, subtitle: 'Nad Ostrovem 1119/7, 147 00 Praha 4' },
                { icon: Phone, title: t.contact.phone, subtitle: '+420-2-2680 5329' },
                { icon: Mail, title: 'Email', subtitle: 'info@jakubcigler.archi' },
                { icon: Globe, title: 'Web', subtitle: 'www.jakubcigler.archi' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '2px solid rgba(139,69,19,0.15)', clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)' }}>
                  <item.icon className="w-6 h-6 mt-1" style={{ color: '#8B4513' }} />
                  <div>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{item.title}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <CubisticCard>
              <form className="p-8" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '2px solid rgba(139,69,19,0.2)', clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)', boxShadow: '15px 15px 0 rgba(139,69,19,0.1), 30px 30px 60px rgba(0,0,0,0.1)' }}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6B7280' }}>{t.contact.name}</label>
                  <Input placeholder={t.contact.name} className="border-2" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(139,69,19,0.2)', clipPath: 'polygon(1% 0%, 99% 0%, 100% 100%, 0% 100%)' }} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6B7280' }}>{t.contact.email}</label>
                  <Input type="email" placeholder={t.contact.email} className="border-2" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(139,69,19,0.2)', clipPath: 'polygon(1% 0%, 99% 0%, 100% 100%, 0% 100%)' }} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6B7280' }}>{t.contact.message}</label>
                  <Textarea placeholder={t.contact.message} className="border-2 min-h-32" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(139,69,19,0.2)', clipPath: 'polygon(1% 0%, 99% 0%, 100% 100%, 0% 100%)' }} />
                </div>
                <Button type="submit" className="w-full py-6 text-white font-medium transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #B85C38, #8B4513)', clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)', boxShadow: '0 15px 35px -10px rgba(139,69,19,0.4)' }}>
                  {t.contact.send} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CubisticCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-12" style={{ background: 'linear-gradient(135deg, rgba(250,248,245,0.95), rgba(255,255,255,0.95))', borderTop: '2px solid rgba(139,69,19,0.2)' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Gem className="w-8 h-8 mx-auto mb-4" style={{ color: '#8B4513' }} />
        <p className="font-bold tracking-wide mb-2" style={{ color: '#1F2937' }}>JAKUB CIGLER ARCHITEKTI, a.s.</p>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>&copy; 2001-2026 All rights reserved</p>
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
      <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        {loading ? <LoadingScreen onComplete={() => setLoading(false)} /> : (
          <>
            <Navigation />
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <AwardsSection />
            <VideosSection />
            <ContactSection />
            <Footer />
          </>
        )}
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
