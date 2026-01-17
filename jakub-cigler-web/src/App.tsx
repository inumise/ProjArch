import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, Mail, Phone, Award, Building2, Users, Calendar, Play, Globe, ArrowRight } from 'lucide-react';

// Translations
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

// Real project data
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

// Hooks
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

// 3D Tilt Card with realistic depth
function TiltCard3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: x * 100, y: y * 100 });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50 });
  }, []);
  
  return (
    <div ref={cardRef} className={`relative transition-all duration-500 ease-out ${className}`} style={{ transform, transformStyle: 'preserve-3d' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
      <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)` }} />
    </div>
  );
}

// Photorealistic Building Frame - The website IS the building
function BuildingFrame({ children }: { children: React.ReactNode }) {
  const scrollY = useParallax();
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Photorealistic sky background with parallax */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=95" 
          alt="Sky" 
          className="w-full h-full object-cover"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
      </div>

      {/* Building structure - Left wall with real marble texture */}
      <div className="fixed left-0 top-0 bottom-0 w-24 z-40 overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0" style={{ transform: 'rotateY(-12deg)', transformOrigin: 'right' }}>
          {/* Cream/beige marble texture */}
          <div className="w-full h-full" style={{ background: 'linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 25%, #f0e8dc 50%, #ddd4c4 75%, #e5dcd0 100%)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          {/* Marble veins */}
          <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(139,119,101,0.3) 20px, rgba(139,119,101,0.3) 22px)' }} />
        </div>
        {/* Window cutout showing sky */}
        <div className="absolute top-1/4 left-3 w-14 h-40 overflow-hidden rounded-t-lg border-4 border-stone-300" style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), 0 5px 20px rgba(0,0,0,0.3)' }}>
          <img src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&q=90" alt="Sky through window" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Building structure - Right wall with real marble texture */}
      <div className="fixed right-0 top-0 bottom-0 w-24 z-40 overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0" style={{ transform: 'rotateY(12deg)', transformOrigin: 'left' }}>
          {/* Cream/beige marble texture */}
          <div className="w-full h-full" style={{ background: 'linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 25%, #f0e8dc 50%, #ddd4c4 75%, #e5dcd0 100%)' }} />
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent" />
          {/* Marble veins */}
          <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(139,119,101,0.3) 20px, rgba(139,119,101,0.3) 22px)' }} />
        </div>
        {/* Window cutout showing sky */}
        <div className="absolute top-1/4 right-3 w-14 h-40 overflow-hidden rounded-t-lg border-4 border-stone-300" style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), 0 5px 20px rgba(0,0,0,0.3)' }}>
          <img src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&q=90" alt="Sky through window" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Top cornice/header with real stone texture */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #d4c8b8 0%, #c9bba8 50%, #bfae98 100%)' }}>
          {/* Stone texture pattern */}
          <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139,119,101,0.2) 40px, rgba(139,119,101,0.2) 42px)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/20" />
        </div>
        <div className="relative h-full max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-2xl border-2 border-white/30" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&q=90" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                <span className="text-orange-400">JAKUB CIGLER</span> ARCHITEKTI
              </h1>
              <p className="text-white/80 text-xs tracking-widest drop-shadow">PROGRESSIVE ARCHITECTURE SINCE 2001</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+420226805329" className="flex items-center gap-2 text-white/90 hover:text-orange-400 transition-colors drop-shadow">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+420 226 805 329</span>
            </a>
            <a href="mailto:info@jakubcigler.archi" className="flex items-center gap-2 text-white/90 hover:text-orange-400 transition-colors drop-shadow">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">info@jakubcigler.archi</span>
            </a>
          </div>
        </div>
        {/* Decorative cornice molding */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-stone-300 to-stone-500 shadow-lg" />
      </header>

      {/* Main content area - the "interior" of the building */}
      <main className="relative z-10 pt-24 pb-20 ml-24 mr-24 min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100">
        {/* Interior wall texture overlay - subtle marble pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
          background: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(200,180,160,0.1) 100px, rgba(200,180,160,0.1) 102px)'
        }} />
        {children}
      </main>

      {/* Bottom foundation with real stone pillars */}
      <footer className="relative z-20 ml-24 mr-24">
        {/* Pillar colonnade with photorealistic marble */}
        <div className="relative h-96 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5f0e8 0%, #e8e0d4 50%, #ddd4c4 100%)' }}>
          <div className="absolute inset-0 flex justify-around items-end px-12 pb-0">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative flex flex-col items-center" style={{ height: `${260 + (i % 3) * 20}px` }}>
                {/* Capital - Corinthian style with ornate top */}
                <div className="w-24 relative">
                  {/* Abacus (top plate) */}
                  <div className="w-28 h-4 -ml-2 rounded-t shadow-lg" style={{ background: 'linear-gradient(180deg, #f5f0e8 0%, #e0d6c8 100%)' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                  </div>
                  {/* Echinus (curved part) */}
                  <div className="w-26 h-6 -ml-1 shadow-md" style={{ background: 'linear-gradient(180deg, #e8dfd0 0%, #d4c8b8 100%)', borderRadius: '0 0 4px 4px' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/10" />
                  </div>
                  {/* Decorative band */}
                  <div className="w-24 h-3 shadow-sm" style={{ background: 'linear-gradient(180deg, #ddd4c4 0%, #c9bba8 100%)' }} />
                </div>
                
                {/* Shaft with fluting and 3D cylindrical effect */}
                <div className="flex-1 w-18 relative overflow-hidden" style={{ 
                  background: 'linear-gradient(90deg, #c9bba8 0%, #e8dfd0 15%, #f5f0e8 30%, #fff 50%, #f5f0e8 70%, #e8dfd0 85%, #c9bba8 100%)',
                  boxShadow: '8px 0 20px rgba(0,0,0,0.25), -8px 0 20px rgba(0,0,0,0.25), inset 0 0 30px rgba(0,0,0,0.1)'
                }}>
                  {/* Fluting grooves - vertical channels */}
                  <div className="absolute inset-0 flex">
                    {[0,1,2,3,4,5,6,7,8,9].map((j) => (
                      <div key={j} className="flex-1" style={{ 
                        background: j % 2 === 0 
                          ? 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, transparent 50%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.15) 100%)' 
                          : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                      }} />
                    ))}
                  </div>
                  {/* Vertical marble veins */}
                  <div className="absolute top-0 left-1/4 w-px h-full bg-stone-300/40" />
                  <div className="absolute top-0 left-2/3 w-px h-full bg-stone-300/30" />
                  {/* Light highlight */}
                  <div className="absolute inset-y-0 left-1/3 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
                
                {/* Base - Attic base style */}
                <div className="w-20 relative">
                  {/* Torus (upper ring) */}
                  <div className="w-20 h-3 shadow-md" style={{ background: 'linear-gradient(180deg, #e8dfd0 0%, #d4c8b8 50%, #c9bba8 100%)', borderRadius: '2px' }} />
                  {/* Scotia (concave molding) */}
                  <div className="w-22 h-4 -ml-1 shadow-lg" style={{ background: 'linear-gradient(180deg, #c9bba8 0%, #bfae98 50%, #d4c8b8 100%)' }} />
                  {/* Plinth (bottom block) */}
                  <div className="w-26 h-6 -ml-3 rounded-b shadow-xl" style={{ background: 'linear-gradient(180deg, #d4c8b8 0%, #bfae98 50%, #a89880 100%)' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-b" />
                  </div>
                </div>
                
                {/* Pillar shadow on ground */}
                <div className="absolute -bottom-6 w-32 h-10 bg-black/40 rounded-full blur-lg" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Ground/Garden with real grass */}
        <div className="relative h-32 overflow-hidden">
          {/* Grass background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 30%, #16a34a 60%, #15803d 100%)' }} />
          {/* Grass blade texture */}
          <div className="absolute inset-0" style={{ 
            background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,100,0,0.3) 3px, rgba(0,100,0,0.3) 4px)',
          }} />
          {/* Individual grass blades */}
          <div className="absolute bottom-0 left-0 right-0 h-20 flex justify-around">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="w-1 origin-bottom" style={{ 
                height: `${15 + Math.random() * 25}px`,
                background: `linear-gradient(180deg, #86efac 0%, #22c55e 100%)`,
                transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
                borderRadius: '50% 50% 0 0'
              }} />
            ))}
          </div>
          {/* Soil/earth at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: 'linear-gradient(180deg, #15803d 0%, #3d2914 50%, #1c1917 100%)' }} />
        </div>
        
        {/* Footer info */}
        <div className="bg-stone-900 py-8 px-12 text-center">
          <p className="text-stone-400 text-sm mb-2">© 2026 JAKUB CIGLER ARCHITEKTI, a.s.</p>
          <p className="text-stone-500 text-xs">Nad Ostrovem 1119/7, 147 00 Praha 4 - Podolí, Czech Republic</p>
        </div>
      </footer>
    </div>
  );
}

function Navigation() {
  const { lang, setLang, t } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langLabels: Record<Language, string> = { cs: 'CZ', en: 'EN', zh: '中文', ar: 'عربي' };

  return (
    <div className="sticky top-20 z-30 backdrop-blur-xl bg-white/90 border-b border-stone-200 shadow-lg">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <nav className="flex gap-10">
          {Object.entries(t.nav).map(([key, value]) => (
            <a key={key} href={`#${key}`} className="text-stone-600 hover:text-orange-500 text-sm font-medium tracking-wide transition-all hover:scale-105">
              {value}
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
  const scrollY = useParallax();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-4">
      {/* Photorealistic architectural background with parallax */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=95" 
          alt="Modern Architecture" 
          className="w-full h-full object-cover transition-transform duration-100"
          style={{ transform: `scale(1.1) translateY(${scrollY * 0.2}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/90" />
      </div>
      
      {/* 3D floating architectural elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '1500px' }}>
        <div className="absolute top-32 left-20 w-48 h-32 rounded-2xl overflow-hidden shadow-2xl animate-float3d" style={{ transform: 'rotateY(-20deg) rotateX(10deg)' }}>
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=90" alt="Building" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-48 right-24 w-40 h-56 rounded-2xl overflow-hidden shadow-2xl animate-float3d-slow" style={{ transform: 'rotateY(15deg) rotateX(-5deg)' }}>
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=90" alt="Building" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-40 left-1/4 w-36 h-24 rounded-xl overflow-hidden shadow-2xl animate-float3d" style={{ transform: 'rotateY(-10deg) rotateX(15deg)' }}>
          <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=90" alt="Building" className="w-full h-full object-cover" />
        </div>
      </div>
      
      {/* Hero content with glass effect */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-12 shadow-2xl border border-white/30" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
          <div className="mb-6 animate-fadeInUp">
            <span className="inline-block px-6 py-2 bg-orange-500/90 rounded-full text-white text-sm font-medium tracking-widest uppercase shadow-lg">
              {t.hero.subtitle}
            </span>
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tight mb-6 animate-fadeInUp drop-shadow-2xl" style={{ animationDelay: '0.2s', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
            JAKUB CIGLER
            <span className="block text-3xl md:text-4xl mt-4 font-light tracking-wide text-white/90">ARCHITEKTI</span>
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-light mb-10 animate-fadeInUp drop-shadow-lg" style={{ animationDelay: '0.4s' }}>
            {t.hero.tagline}
          </p>
          <a href="#projects" className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 text-lg font-semibold tracking-wide hover:from-orange-600 hover:to-orange-700 transition-all rounded-2xl shadow-2xl animate-fadeInUp group hover:scale-105" style={{ animationDelay: '0.6s', boxShadow: '0 20px 40px rgba(234, 88, 12, 0.4)' }}>
            {t.hero.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fadeInUp" style={{ animationDelay: '1s' }}>
        <div className="w-8 h-14 border-2 border-white/60 rounded-full flex justify-center p-2 backdrop-blur-sm">
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
    <section id="profile" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          <TiltCard3D className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative group">
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
                <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=95" alt="JCA Architecture" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=90" alt="Building detail" className="w-full h-full object-cover" />
              </div>
            </div>
          </TiltCard3D>
          
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'} ${lang === 'ar' ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-900 mb-6">
              {t.about.title}
              <span className="block w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mt-4 rounded-full" />
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-4">{t.about.description}</p>
            <p className="text-stone-500 text-base leading-relaxed mb-10">{t.about.description2}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    <stat.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-stone-900 mb-1">
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
    <section id="projects" className="py-24 bg-gradient-to-b from-stone-100 to-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8">
        <div className={`mb-16 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            {t.projects.title}
            <span className="block w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mt-4 rounded-full" />
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Dialog key={project.id}>
              <DialogTrigger asChild>
                <div className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TiltCard3D className="cursor-pointer group">
                    <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-500">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <span className={`inline-block text-xs px-3 py-1 mb-2 rounded-full font-medium ${project.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                              {project.status === 'completed' ? t.projects.completed : t.projects.inProgress} {project.year}
                            </span>
                            <h3 className="text-xl font-bold text-white">{project.name}</h3>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-stone-900 mb-1">{project.name}</h3>
                          <p className="text-stone-500 text-sm">{project.area} • {project.client}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard3D>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-white border-0 rounded-2xl shadow-2xl overflow-hidden">
                <DialogHeader className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                  </div>
                </DialogHeader>
                <div className="p-6">
                  <DialogTitle className="text-2xl font-bold text-stone-900 mb-3">{project.name}</DialogTitle>
                  <p className="text-stone-600 mb-6">{lang === 'en' ? project.descriptionEn : project.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-stone-100 rounded-xl p-3 text-center">
                      <p className="text-stone-500 text-xs mb-1">{t.projects.area}</p>
                      <p className="text-stone-900 font-bold">{project.area}</p>
                    </div>
                    <div className="bg-stone-100 rounded-xl p-3 text-center">
                      <p className="text-stone-500 text-xs mb-1">{t.projects.client}</p>
                      <p className="text-stone-900 font-bold text-sm">{project.client}</p>
                    </div>
                    <div className="bg-stone-100 rounded-xl p-3 text-center">
                      <p className="text-stone-500 text-xs mb-1">Status</p>
                      <p className={`font-bold ${project.status === 'completed' ? 'text-emerald-600' : 'text-orange-600'}`}>
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
    <section id="awards" className="py-24 relative overflow-hidden">
      {/* Photorealistic dark architectural background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90" alt="Building" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-900/90" />
      </div>
      
      <div className="max-w-5xl mx-auto px-8 relative">
        <div className={`mb-16 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            {t.awards.title}
            <span className="block w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mt-4 rounded-full" />
          </h2>
          <p className="text-stone-400 text-lg">{t.awards.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <TiltCard3D key={index}>
              <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-orange-500/50 transition-all rounded-2xl h-full group hover:bg-white/20">
                <div className="text-5xl font-black text-orange-500 mb-4 group-hover:scale-110 transition-transform">{award.year}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{award.title}</h3>
                <p className="text-stone-400 text-sm">{award.project}</p>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  const { t, lang } = useLanguage();
  return (
    <section id="videos" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8">
        <div className={`mb-16 ${lang === 'ar' ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            {t.videos.title}
            <span className="block w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mt-4 rounded-full" />
          </h2>
          <p className="text-stone-500 text-lg">{t.videos.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <TiltCard3D className="cursor-pointer group">
                  <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-6 h-6 text-orange-500 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-stone-900">{video.title}</h3>
                    <p className="text-stone-500 text-sm mt-1">{video.description}</p>
                  </div>
                </TiltCard3D>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-stone-900 border-0 rounded-2xl overflow-hidden">
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
    <section id="contact" className="py-24 bg-gradient-to-b from-stone-100 to-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className={lang === 'ar' ? 'text-right' : ''}>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              {t.contact.title}
              <span className="block w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mt-4 rounded-full" />
            </h2>
            <p className="text-stone-500 text-lg mb-10">{t.contact.subtitle}</p>
            
            <div className="space-y-6">
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center rounded-xl shadow-lg">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">{t.contact.company}</h3>
                  <p className="text-stone-500 text-sm">Nad Ostrovem 1119/7<br />147 00 Praha 4 - Podolí<br />Czech Republic</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center rounded-xl shadow-lg">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">{t.contact.phone}</h3>
                  <p className="text-stone-500 text-sm">+420-2-2680 5329</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center rounded-xl shadow-lg">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">E-mail</h3>
                  <a href="mailto:info@jakubcigler.archi" className="text-stone-500 text-sm hover:text-orange-500 transition-colors">info@jakubcigler.archi</a>
                </div>
              </div>
            </div>
          </div>
          
          <TiltCard3D>
            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 border border-stone-200 rounded-2xl shadow-xl">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">{t.contact.name}</label>
                <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-12 bg-stone-50 border-stone-200 focus:border-orange-500 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">{t.contact.email}</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-12 bg-stone-50 border-stone-200 focus:border-orange-500 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">{t.contact.message}</label>
                <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} className="bg-stone-50 border-stone-200 focus:border-orange-500 rounded-xl resize-none" />
              </div>
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30">
                {submitted ? '✓ Odesláno!' : t.contact.send}
              </Button>
            </form>
          </TiltCard3D>
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
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        {/* Photorealistic loading background */}
        <img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=95" alt="Loading" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" />
        <div className="relative text-center">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl mx-auto animate-pulse" style={{ boxShadow: '0 0 60px rgba(234, 88, 12, 0.5)' }}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=90" alt="Loading" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-2xl">
            <span className="text-orange-500">JAKUB CIGLER</span> ARCHITEKTI
          </h1>
          <p className="text-white/70 text-sm tracking-widest mb-6">LOADING ARCHITECTURAL EXPERIENCE</p>
          <div className="w-64 h-2 bg-stone-800 mx-auto overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 animate-loading-bar rounded-full" />
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
