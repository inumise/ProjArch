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
    projects: { title: 'Vybrane projekty', completed: 'Dokonceno', inProgress: 'V realizaci', area: 'Plocha', client: 'Klient' },
    awards: { title: 'Oceneni', subtitle: 'Mezinarodne uznavana kvalita' },
    videos: { title: 'Videa', subtitle: 'Podivejte se na nase projekty' },
    contact: { title: 'Kontakt', subtitle: 'Spojte se s nami', name: 'Jmeno', email: 'E-mail', message: 'Zprava', send: 'Odeslat zpravu', phone: 'Telefon', company: 'JAKUB CIGLER ARCHITEKTI, a.s.' },
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
  { id: 1, name: 'Victoria Palace', nameEn: 'Victoria Palace', description: 'Budova Victoria Palace je po temer 90 letech prvni novostavbou na Viteznem namesti.', descriptionEn: 'The Victoria Palace building is the first new building in almost 90 years on Victory Square.', year: '2024', status: 'completed', area: '12,390 m2', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=90', category: 'administrative' },
  { id: 2, name: 'Florentinum', nameEn: 'Florentinum', description: 'Multifunkcni administrativni komplex.', descriptionEn: 'Multifunction administrative complex.', year: '2013', status: 'completed', area: '126,000 m2', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=90', category: 'administrative' },
  { id: 3, name: 'Quadrio', nameEn: 'Quadrio', description: 'Rezidencni budova v historickem centru Prahy.', descriptionEn: 'Residential building in the historic center of Prague.', year: '2014', status: 'completed', area: '45,000 m2', client: 'CPI Property Group', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=90', category: 'mixed' },
  { id: 4, name: 'Churchill I.', nameEn: 'Churchill I.', description: 'Administrativni budova na namesti W. Churchilla.', descriptionEn: 'Administrative building on W. Churchill square.', year: '2019', status: 'completed', area: '33,100 m2', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1920&q=90', category: 'administrative' },
  { id: 5, name: 'Dynamica', nameEn: 'Dynamica', description: 'Moderni administrativni budova.', descriptionEn: 'Modern administrative building.', year: '2018', status: 'completed', area: '25,000 m2', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90', category: 'administrative' },
  { id: 6, name: 'Aviatica', nameEn: 'Aviatica', description: 'Kancelarska budova certifikovana LEED Gold.', descriptionEn: 'Office building certified LEED Gold.', year: '2015', status: 'completed', area: '27,000 m2', client: 'Penta Investments', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1920&q=90', category: 'administrative' },
  { id: 7, name: 'Masarykovo nadrazi', nameEn: 'Masaryk Railway Station', description: 'Modernizace historickeho nadrazi se Zaha Hadid Architects.', descriptionEn: 'Modernization of historic station with Zaha Hadid Architects.', year: '2025', status: 'in_progress', area: '150,000 m2', client: 'Penta Real Estate', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=90', category: 'mixed' },
  { id: 8, name: 'The Park', nameEn: 'The Park', description: 'Viceucelovy komplex v Chodove.', descriptionEn: 'Multipurpose complex in Chodov.', year: '2011', status: 'completed', area: '190,000 m2', client: 'AIG/Lincoln', image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1920&q=90', category: 'mixed' },
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
  { id: 1, title: 'Prague Architecture Walk', thumbnail: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1280&q=90', embedUrl: 'https://www.youtube.com/embed/I24qiVmY6Uk', description: 'Architektonicka prochazka Prahou' },
  { id: 2, title: 'Masarycka by Zaha Hadid', thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&q=90', embedUrl: 'https://www.youtube.com/embed/I24qiVmY6Uk?start=2481', description: 'Masarycka od Zaha Hadid Architects' },
  { id: 3, title: 'Prague Hidden Secrets', thumbnail: 'https://images.unsplash.com/photo-1458150945447-7fb764c11a92?w=1280&q=90', embedUrl: 'https://www.youtube.com/embed/PvlDc_epoUU', description: 'Skryte tajemstvi Prahy' },
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
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`);
  }, [intensity]);
  const handleMouseLeave = useCallback(() => { setTransform(''); }, []);
  return (
    <div ref={cardRef} className={`transition-transform duration-500 ${className}`} style={{ transform, transformStyle: 'preserve-3d' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}

// Hyper-realistic Modern Greek Pillar with marble texture
function ModernPillar({ height = 280, variant = 'ionic' }: { height?: number; variant?: 'ionic' | 'corinthian' | 'doric' }) {
  return (
    <div className="pillar-3d flex flex-col items-center relative" style={{ height, perspective: '1000px' }}>
      {/* Capital - ornate top */}
      <div className="relative w-24 z-10">
        {variant === 'corinthian' && (
          <>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-b from-amber-100 via-stone-200 to-stone-300 rounded-t-lg shadow-lg" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-3 h-6 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full transform rotate-12 origin-bottom" style={{ transform: `rotate(${(i-2)*15}deg)` }} />
              ))}
            </div>
          </>
        )}
        <div className="w-24 h-5 bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 rounded-t shadow-inner border-t border-stone-100" />
        <div className="w-28 h-3 bg-gradient-to-b from-stone-200 to-stone-400 -ml-2 shadow-md" />
        {variant === 'ionic' && (
          <div className="flex justify-between w-32 -ml-4 -mt-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 shadow-lg border-2 border-stone-300" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 shadow-lg border-2 border-stone-300" />
          </div>
        )}
      </div>
      
      {/* Shaft with fluting and marble texture */}
      <div className="flex-1 w-16 relative overflow-hidden rounded-sm shadow-2xl" style={{ background: 'linear-gradient(90deg, #d6d3d1 0%, #fafaf9 15%, #e7e5e4 30%, #fafaf9 50%, #e7e5e4 70%, #fafaf9 85%, #d6d3d1 100%)' }}>
        {/* Fluting grooves */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} className="absolute top-0 bottom-0 w-px" style={{ left: `${(i+1)*11}%`, background: 'linear-gradient(180deg, rgba(120,113,108,0.3) 0%, rgba(168,162,158,0.2) 50%, rgba(120,113,108,0.3) 100%)' }} />
        ))}
        {/* Light reflection */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ left: '20%', width: '30%' }} />
        {/* Marble veins */}
        <div className="absolute top-10 left-2 w-12 h-px bg-stone-300/50 rotate-12" />
        <div className="absolute top-32 left-4 w-8 h-px bg-stone-300/40 -rotate-6" />
        <div className="absolute bottom-20 left-1 w-10 h-px bg-stone-300/30 rotate-3" />
      </div>
      
      {/* Base with torus molding */}
      <div className="relative w-20 z-10">
        <div className="w-20 h-3 bg-gradient-to-b from-stone-300 to-stone-400 shadow-md" />
        <div className="w-24 h-4 bg-gradient-to-b from-stone-400 to-stone-500 -ml-2 rounded-sm shadow-lg" />
        <div className="w-28 h-5 bg-gradient-to-b from-stone-500 to-stone-600 -ml-4 rounded-b shadow-xl" />
      </div>
      
      {/* Ground shadow */}
      <div className="absolute -bottom-2 w-32 h-4 bg-black/20 rounded-full blur-md" />
    </div>
  );
}

// Greenery/Plant element
function PlantElement({ type = 'hanging' }: { type?: 'hanging' | 'pot' | 'vine' }) {
  if (type === 'hanging') {
    return (
      <div className="relative">
        <div className="w-16 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-full" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex gap-1" style={{ marginTop: i > 0 ? '-4px' : '0' }}>
              {[0,1,2].map(j => (
                <div key={j} className="w-4 h-6 bg-gradient-to-b from-green-500 to-green-700 rounded-full transform" style={{ transform: `rotate(${(j-1)*20}deg)`, animationDelay: `${(i+j)*0.2}s` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'pot') {
    return (
      <div className="relative">
        <div className="w-12 h-10 bg-gradient-to-b from-orange-600 to-orange-800 rounded-b-lg" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="absolute w-3 h-10 bg-gradient-to-t from-green-700 to-green-500 rounded-t-full" style={{ left: `${(i-2)*8}px`, transform: `rotate(${(i-2)*12}deg)`, transformOrigin: 'bottom' }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className="w-2 h-8 bg-gradient-to-r from-green-600 to-green-500 rounded-full -mt-2 first:mt-0" style={{ marginLeft: `${(i%2)*8}px` }} />
      ))}
    </div>
  );
}

// Glass Balcony with railing
function Balcony({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Glass floor */}
      <div className="w-full h-4 bg-gradient-to-b from-sky-200/50 to-sky-300/30 backdrop-blur-sm border-b-2 border-stone-400 shadow-lg" />
      {/* Railing */}
      <div className="absolute -top-16 left-0 right-0 flex justify-between px-2">
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} className="w-1 h-16 bg-gradient-to-b from-stone-300 to-stone-500 rounded-t" />
        ))}
      </div>
      <div className="absolute -top-16 left-0 right-0 h-2 bg-gradient-to-b from-stone-200 to-stone-400 rounded-t" />
      {/* Plants on balcony */}
      <div className="absolute -top-12 left-4">
        <PlantElement type="pot" />
      </div>
      <div className="absolute -top-12 right-4">
        <PlantElement type="pot" />
      </div>
      {children}
    </div>
  );
}

// 3D Building Frame
function BuildingFrame3D({ children }: { children: React.ReactNode }) {
  const [_scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ perspective: '2000px' }}>
      {/* Sky background with parallax */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 30%, #7dd3fc 60%, #e0f2fe 100%)' }}>
        {/* Clouds */}
        <div className="absolute top-20 left-10 w-40 h-16 bg-white/80 rounded-full blur-sm animate-cloud1" />
        <div className="absolute top-32 right-20 w-56 h-20 bg-white/70 rounded-full blur-sm animate-cloud2" />
        <div className="absolute top-48 left-1/3 w-32 h-12 bg-white/60 rounded-full blur-sm animate-cloud3" />
      </div>

      {/* Main 3D container */}
      <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        {/* Header - Glass facade */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-orange-500">JAKUB CIGLER</span>
                  <span className="text-stone-800"> ARCHITEKTI</span>
                </h1>
                <p className="text-stone-600 text-xs tracking-widest">PROGRESSIVE ARCHITECTURE SINCE 2001</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="tel:+420226805329" className="flex items-center gap-2 text-stone-700 hover:text-orange-500 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+420 226 805 329</span>
              </a>
              <a href="mailto:info@jakubcigler.archi" className="flex items-center gap-2 text-stone-700 hover:text-orange-500 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">info@jakubcigler.archi</span>
              </a>
            </div>
          </div>
        </header>

        {/* Left architectural column with greenery */}
        <div className="fixed left-0 top-20 bottom-0 w-24 z-40 flex flex-col items-center justify-between py-8" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,250,249,0.9) 100%)', boxShadow: '4px 0 30px rgba(0,0,0,0.1)' }}>
          <div className="flex flex-col items-center gap-4">
            <PlantElement type="hanging" />
          </div>
          <nav className="flex flex-col items-center gap-6">
            {['profile', 'projects', 'awards', 'videos', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="text-stone-500 hover:text-orange-500 transition-all text-xs tracking-widest uppercase font-medium" style={{ writingMode: 'vertical-rl' }}>
                {item}
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-2">
            <PlantElement type="vine" />
          </div>
        </div>

        {/* Right architectural column */}
        <div className="fixed right-0 top-20 bottom-0 w-24 z-40 flex flex-col items-center justify-between py-8" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,250,249,0.9) 100%)', boxShadow: '-4px 0 30px rgba(0,0,0,0.1)' }}>
          <div className="flex flex-col items-center gap-4">
            <PlantElement type="hanging" />
          </div>
          <div className="flex flex-col gap-4">
            <a href="#contact" className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all">
              <Mail className="w-5 h-5 text-white" />
            </a>
            <a href="tel:+420226805329" className="w-12 h-12 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all">
              <Phone className="w-5 h-5 text-white" />
            </a>
            <a href="https://jakubcigler.archi" target="_blank" className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all">
              <Globe className="w-5 h-5 text-white" />
            </a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <PlantElement type="vine" />
          </div>
        </div>

        {/* Main content area */}
        <main className="ml-24 mr-24 relative" style={{ background: 'linear-gradient(180deg, #fafaf9 0%, #ffffff 50%, #f5f5f4 100%)' }}>
          {children}
        </main>

        {/* Footer with monumental pillars */}
        <footer className="ml-24 mr-24 relative">
          {/* Balcony section */}
          <div className="relative bg-gradient-to-b from-stone-100 to-stone-200 pt-8 pb-4">
            <Balcony />
          </div>
          
          {/* Pillar colonnade */}
          <div className="relative bg-gradient-to-b from-stone-200 to-stone-300 pt-12 pb-8">
            <div className="flex justify-around items-end px-12">
              <ModernPillar height={240} variant="doric" />
              <ModernPillar height={280} variant="ionic" />
              <ModernPillar height={320} variant="corinthian" />
              <ModernPillar height={320} variant="corinthian" />
              <ModernPillar height={280} variant="ionic" />
              <ModernPillar height={240} variant="doric" />
            </div>
          </div>
          
          {/* Ground/Garden */}
          <div className="relative h-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #16a34a 0%, #15803d 40%, #166534 70%, #14532d 100%)' }}>
            {/* Grass blades */}
            {Array.from({length: 60}).map((_, i) => (
              <div key={i} className="absolute bottom-0 w-1 bg-gradient-to-t from-green-900 to-green-500 rounded-t-full animate-grass" style={{ left: `${i * 1.7}%`, height: `${25 + (i % 7) * 8}px`, animationDelay: `${i * 0.05}s`, transform: `rotate(${-4 + (i % 8)}deg)` }} />
            ))}
            {/* Flowers */}
            {[10, 25, 45, 70, 85].map((pos, i) => (
              <div key={i} className="absolute bottom-4" style={{ left: `${pos}%` }}>
                <div className="w-3 h-12 bg-green-700 rounded-full" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" style={{ background: ['#f97316', '#ec4899', '#8b5cf6', '#eab308', '#ef4444'][i] }} />
              </div>
            ))}
            {/* Ground texture */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-900/60 to-transparent" />
          </div>
          
          {/* Footer info */}
          <div className="bg-stone-900 py-8 px-12 text-center">
            <p className="text-stone-400 text-sm mb-2">© 2026 JAKUB CIGLER ARCHITEKTI, a.s.</p>
            <p className="text-stone-500 text-xs">Nad Ostrovem 1119/7, 147 00 Praha 4 - Podoli, Czech Republic</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Navigation() {
  const { lang, setLang } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langLabels: Record<Language, string> = { cs: 'CZ', en: 'EN', zh: '中文', ar: 'عربي' };

  return (
    <div className="sticky top-20 z-30 backdrop-blur-xl bg-white/80 border-b border-stone-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <nav className="flex gap-10">
          {['profile', 'projects', 'awards', 'videos', 'contact'].map((item) => (
            <a key={item} href={`#${item}`} className="text-stone-600 hover:text-orange-500 text-sm font-medium tracking-wide capitalize transition-all hover:scale-105">
              {item}
            </a>
          ))}
        </nav>
        <div className="relative">
          <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-2 text-sm text-stone-600 hover:text-orange-500 font-medium">
            <Globe className="w-4 h-4" /> {langLabels[lang]} <ChevronDown className="w-3 h-3" />
          </button>
          {langMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-2xl py-2 min-w-24 overflow-hidden">
              {(Object.keys(langLabels) as Language[]).map((l) => (
                <button key={l} onClick={() => { setLang(l); setLangMenuOpen(false); }} className={`block w-full px-4 py-2 text-left text-sm hover:bg-orange-50 transition-colors ${lang === l ? 'text-orange-500 font-semibold bg-orange-50' : 'text-stone-600'}`}>
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* High-res architectural background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=90" alt="Modern Architecture" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
      </div>
      
      {/* 3D floating geometric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="absolute top-20 left-20 w-40 h-40 border-2 border-orange-400/40 rotate-12 animate-float3d" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute top-40 right-32 w-32 h-48 border-2 border-stone-400/30 -rotate-6 animate-float3d-slow" />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rotate-45 animate-float3d backdrop-blur-sm" />
        <div className="absolute bottom-32 right-1/4 w-20 h-20 border-4 border-sky-400/30 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-stone-300/30 to-stone-500/30 animate-spin-slow" />
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 text-center px-8 max-w-5xl">
        <div className="mb-8 animate-fadeInUp">
          <span className="inline-block px-6 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-600 text-sm font-medium tracking-widest uppercase backdrop-blur-sm">
            {t.hero.subtitle}
          </span>
        </div>
        <h1 className="text-stone-900 text-6xl md:text-8xl font-black tracking-tighter mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s', textShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
          JAKUB CIGLER
          <span className="block text-4xl md:text-5xl mt-4 font-light text-stone-600 tracking-wide">ARCHITEKTI</span>
        </h1>
        <p className="text-stone-500 text-xl md:text-2xl font-light mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          {t.hero.tagline}
        </p>
        <a href="#projects" className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 text-lg font-semibold tracking-wide hover:from-orange-600 hover:to-orange-700 transition-all rounded-2xl shadow-2xl shadow-orange-500/30 animate-fadeInUp group hover:scale-105" style={{ animationDelay: '0.6s' }}>
          {t.hero.cta}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </a>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fadeInUp" style={{ animationDelay: '1s' }}>
        <div className="w-8 h-14 border-2 border-stone-400 rounded-full flex justify-center p-2">
          <div className="w-2 h-4 bg-orange-500 rounded-full animate-bounce" />
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
    <section id="profile" className="py-32 relative overflow-hidden">
      {/* Architectural grid background */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#78716c 1px, transparent 1px), linear-gradient(90deg, #78716c 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      <div className="max-w-6xl mx-auto px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-20 items-center">
          <TiltCard className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative">
              {/* Main image with 3D frame */}
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl" style={{ transform: 'perspective(1000px) rotateY(-5deg)', transformStyle: 'preserve-3d' }}>
                <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=90" alt="JCA Architecture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent" />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center" style={{ transform: 'perspective(500px) rotateX(10deg) rotateY(-10deg)' }}>
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </TiltCard>
          
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'} ${lang === 'ar' ? 'text-right' : ''}`}>
            <h2 className="text-5xl font-bold text-stone-900 mb-8">
              {t.about.title}
              <span className="block w-24 h-2 bg-gradient-to-r from-orange-500 to-orange-600 mt-6 rounded-full" />
            </h2>
            <p className="text-stone-600 text-xl leading-relaxed mb-6">{t.about.description}</p>
            <p className="text-stone-500 text-lg leading-relaxed mb-12">{t.about.description2}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all shadow-lg">
                    <stat.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="text-4xl font-bold text-stone-900 mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider font-medium">{stat.label}</div>
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
    <section id="projects" className="py-32 bg-gradient-to-b from-stone-100 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-8">
        <div className={`mb-20 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-5xl font-bold text-stone-900 mb-4">
            {t.projects.title}
            <span className="block w-24 h-2 bg-gradient-to-r from-orange-500 to-orange-600 mt-6 rounded-full" />
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <Dialog key={project.id}>
              <DialogTrigger asChild>
                <div className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TiltCard className="cursor-pointer group" intensity={10}>
                    <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-500">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <span className={`inline-block text-xs px-4 py-1.5 mb-3 rounded-full font-medium ${project.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                              {project.status === 'completed' ? t.projects.completed : t.projects.inProgress} {project.year}
                            </span>
                            <h3 className="text-2xl font-bold text-white">{lang === 'en' ? project.nameEn : project.name}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-stone-900 mb-2">{lang === 'en' ? project.nameEn : project.name}</h3>
                          <p className="text-stone-500 text-sm">{project.area} • {project.client}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-white border-0 rounded-3xl shadow-2xl overflow-hidden">
                <DialogHeader className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                  </div>
                </DialogHeader>
                <div className="p-8">
                  <DialogTitle className="text-3xl font-bold text-stone-900 mb-4">{lang === 'en' ? project.nameEn : project.name}</DialogTitle>
                  <p className="text-stone-600 text-lg mb-8">{lang === 'en' ? project.descriptionEn : project.description}</p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-stone-100 rounded-2xl p-4 text-center">
                      <p className="text-stone-500 text-sm mb-1">{t.projects.area}</p>
                      <p className="text-stone-900 font-bold text-lg">{project.area}</p>
                    </div>
                    <div className="bg-stone-100 rounded-2xl p-4 text-center">
                      <p className="text-stone-500 text-sm mb-1">{t.projects.client}</p>
                      <p className="text-stone-900 font-bold text-lg">{project.client}</p>
                    </div>
                    <div className="bg-stone-100 rounded-2xl p-4 text-center">
                      <p className="text-stone-500 text-sm mb-1">Status</p>
                      <p className={`font-bold text-lg ${project.status === 'completed' ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {project.status === 'completed' ? t.projects.completed : t.projects.inProgress}
                      </p>
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
    <section id="awards" className="py-32 bg-stone-900 text-white relative overflow-hidden">
      {/* Architectural pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #78716c 25%, transparent 25%), linear-gradient(-45deg, #78716c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #78716c 75%), linear-gradient(-45deg, transparent 75%, #78716c 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
      
      <div className="max-w-6xl mx-auto px-8 relative">
        <div className={`mb-20 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-5xl font-bold text-white mb-4">
            {t.awards.title}
            <span className="block w-24 h-2 bg-gradient-to-r from-orange-500 to-orange-600 mt-6 rounded-full" />
          </h2>
          <p className="text-stone-400 text-xl">{t.awards.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <TiltCard key={index} intensity={8}>
              <div className="p-8 bg-stone-800/50 backdrop-blur-sm border border-stone-700 hover:border-orange-500/50 transition-all rounded-3xl h-full group hover:bg-stone-800/80">
                <div className="text-6xl font-black text-orange-500 mb-6 group-hover:scale-110 transition-transform">{award.year}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{award.title}</h3>
                <p className="text-stone-400">{award.project}</p>
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
    <section id="videos" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <div className={`mb-20 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-5xl font-bold text-stone-900 mb-4">
            {t.videos.title}
            <span className="block w-24 h-2 bg-gradient-to-r from-orange-500 to-orange-600 mt-6 rounded-full" />
          </h2>
          <p className="text-stone-500 text-xl">{t.videos.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {videos.map((video) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <TiltCard className="cursor-pointer group" intensity={8}>
                  <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center group-hover:bg-stone-900/20 transition-colors">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-8 h-8 text-orange-500 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-stone-900">{video.title}</h3>
                    <p className="text-stone-500 mt-1">{video.description}</p>
                  </div>
                </TiltCard>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-0 bg-stone-900 border-0 rounded-3xl overflow-hidden">
                <div className="aspect-video">
                  <iframe src={video.embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
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
    <section id="contact" className="py-32 bg-gradient-to-b from-stone-100 to-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className={lang === 'ar' ? 'text-right' : ''}>
            <h2 className="text-5xl font-bold text-stone-900 mb-4">
              {t.contact.title}
              <span className="block w-24 h-2 bg-gradient-to-r from-orange-500 to-orange-600 mt-6 rounded-full" />
            </h2>
            <p className="text-stone-500 text-xl mb-12">{t.contact.subtitle}</p>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center rounded-2xl shadow-lg">
                  <Building2 className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg mb-2">{t.contact.company}</h3>
                  <p className="text-stone-500">Nad Ostrovem 1119/7<br />147 00 Praha 4 - Podoli<br />Czech Republic</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center rounded-2xl shadow-lg">
                  <Phone className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg mb-2">{t.contact.phone}</h3>
                  <p className="text-stone-500">+420-2-2680 5329</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center rounded-2xl shadow-lg">
                  <Mail className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg mb-2">E-mail</h3>
                  <a href="mailto:info@jakubcigler.archi" className="text-stone-500 hover:text-orange-500 transition-colors">info@jakubcigler.archi</a>
                </div>
              </div>
            </div>
          </div>
          
          <TiltCard intensity={5}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 border border-stone-200 rounded-3xl shadow-2xl">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">{t.contact.name}</label>
                <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-14 bg-stone-50 border-stone-200 focus:border-orange-500 rounded-xl text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">{t.contact.email}</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-14 bg-stone-50 border-stone-200 focus:border-orange-500 rounded-xl text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">{t.contact.message}</label>
                <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={6} className="bg-stone-50 border-stone-200 focus:border-orange-500 rounded-xl resize-none text-lg" />
              </div>
              <Button type="submit" className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/30">
                {submitted ? 'Sent!' : t.contact.send}
              </Button>
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
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-orange-500/30 rounded-full animate-spin" style={{ borderTopColor: '#f97316' }} />
            <Building2 className="w-10 h-10 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            <span className="text-orange-500">JAKUB CIGLER</span> ARCHITEKTI
          </h1>
          <div className="w-64 h-1.5 bg-stone-800 mx-auto overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 animate-loading-bar rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div className={`min-h-screen ${isRTL ? 'font-arabic' : 'font-sans'}`}>
        <BuildingFrame3D>
          <Navigation />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <AwardsSection />
          <VideosSection />
          <ContactSection />
        </BuildingFrame3D>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
