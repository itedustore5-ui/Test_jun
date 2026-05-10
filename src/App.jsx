import { useState, useCallback } from "react";

// ── SLIKE ──────────────────────────────────────────────────────────────────────
// Zamenite URL-ove sa pravim putanjama ili base64 stringovima vaših slika.
// Format: { [id_pitanja]: "URL_ili_base64" }
// Primer za lokalnu sliku: import slika7 from "./slike/q7.png"; pa IMGS[7] = slika7
const IMGS = {
  7:  "/slike/q7.png",
  19: "/slike/q19.png",
  20: "/slike/q20.png",
  26: "/slike/q26.png",
  28: "/slike/q28.png",
  42: "/slike/q42.png",
  45: "/slike/q45.png",
};
// ─────────────────────────────────────────────────────────────────────────────

const qs = [
  {id:1,type:"single",pts:1,q:"Tehničar povezuje interni HDD u kućište. Kabl za podatke koji će iskoristiti za povezivanje je:",o:["Molex","SATA","PCIE","PWR_ON"],a:1},
  {id:2,type:"single",pts:1,q:"Za softversko isključivanje računara preko matične ploče koristi se:",o:["Power_Good signal","5 V SB signal","PS_ON signal","PS_OF signal"],a:2},
  {id:3,type:"single",pts:1,q:"Sistemska magistrala (sabirnica) omogućuje povezivanje:",o:["RAM i ROM memorije","RAM i KEŠ memorije","KEŠ memorije i procesora","RAM memorije i procesora"],a:3},
  {id:4,type:"single",pts:1,q:"Korisnik je priključio mobilni telefon na računar i dobio grešku da upravljački program nije uspešno instaliran. Da bi pristupili rešavanju problema upotrebiće:",o:["Component Services","Device Manager","Windows Memory Diagnostics","Data Sources"],a:1},
  {id:5,type:"single",pts:1,q:"Otpušteni programer pristupa administrativnom panelu kompanije koristeći program koji je tokom razvoja aplikacije korišćen za testiranje. Program koji je iskoristio predstavlja:",o:["Ransomware","Rootkit","Trapdoor","Backdoor"],a:3},
  {id:6,type:"single",pts:1,q:'Oštećene sektore ("Bad sectors") hard diska možemo eliminisati tako što:',o:["prepišemo nove podatke preko njih","izolujemo sektore, stavimo ih u posebnu skrivenu particiju","uradimo formatiranje hard diska","uradimo defragmentaciju hard diska"],a:2},
  {id:7,type:"single",pts:1,img:true,q:"Podešavanje kvota za disk E (Limit 450 MB, Warning 400 MB — prikazano na slici), za korisnika znači:",o:["ako prekorači 400MB sistem će upisati događaj o prekoračenju nivoa upozorenja","ako iskoristi više od 400MB biće upozoren da je dostigao nivo upozorenja","ako prekorači 400MB korisnik neće moći na dalje da snima nove fajlove","ako prekorači 450MB korisnik neće moći na dalje da snima nove fajlove"],a:1},
  {id:8,type:"single",pts:1,q:"Računar koji administrirate ima problema sa mrežom. Da biste pronašli adresu računara sa kojim računar ima aktivnu TCP vezu vi ćete:",o:["Iz Windows Administrative Tools-а, otvorite Performance Monitor","U Control Panel-у, otvorite Network and Internet → Network and Sharing Center","Iz Windows Administrative Tools-а, otvorite Resource Monitor","Otvorite Update and Security → Windows Security → Firewall and Network protection"],a:2},
  {id:9,type:"single",pts:1,q:"Grupi Menadzeri imate Full Control NTFS za C:\\Documents\\Projekti.doc. Datoteku preselite u C:\\Poverljivo gde je Menadzeri dodeljena Read. Efektivna dozvola korisnika Marko (član grupe Menadzeri) je:",o:["Full Control","Modify","Read","Write"],a:0},
  {id:10,type:"single",pts:1,q:"Programe koje koristimo prilikom testiranja kompletnog sistema, nazivamo:",o:["aplikativni programi","benchmark programi","sekvenсeri"],a:1},
  {id:11,type:"single",pts:1,q:"Potrebno je u određenom vremenskom intervalu prikupiti podatke o radu ključnih komponenti radi naknadne analize. Alat koji Windows nudi je:",o:["Resource Monitor","Performance Monitor","Disk Defragmentation"],a:1},
  {id:12,type:"single",pts:1,q:"Servisni paket (service pack) je:",o:["kolekcija ažuriranja softvera","oblik špijunskog softvera","režim napajanja dizajniran za napajanje u nuždi","kolekcija pozadina radne površine, zvukova i tema sa interneta"],a:0},
  {id:13,type:"single",pts:1,q:"Da biste konfigurisali Windows da povremeno i automatski proverava najnoviji drajver za video karticu koristićete:",o:["Device Manager","Windows installer","Programs and Features","Windows Update"],a:3},
  {id:14,type:"single",pts:1,q:'Korisnik dobija poruku: "This user account has expired." Da bi ste omogućili korisniku da se prijavi na domen:',o:["izmenite svojstva naloga da biste produžili vreme prijave na domen","izmenite podrazumevanu politiku domena da biste smanjili trajanje zaključanog naloga","izmenite svojstva naloga da biste podesili nalog da nikada ne ističe","izmenite svojstva naloga kako biste podesili da lozinka nikada ne ističe"],a:2},
  {id:15,type:"single",pts:1,q:"Predmer i predračun su delovi:",o:["opšte dokumentacije","grafičke dokumentacije","tekstualne dokumentacije","numeričke dokumentacije"],a:3},
  {id:16,type:"single",pts:1,q:"Ponuda za izvođenje radova se daje na osnovu:",o:["predmera i predračuna","tehničkih uslova","tehničkog opisa"],a:0},
  {id:17,type:"single",pts:1,q:"Komisiju za tehnički pregled formira:",o:["lokalna samouprava","inspektor rada","investitor"],a:2},
  {id:18,type:"single",pts:1,q:"Servisna knjižica NE sadrži:",o:["plan redovnog održavanja","specifikaciju komponenti računarskog sistema","cenu kupljene opreme","listu interventnih pregleda sa opisom intervencija"],a:2},
  {id:19,type:"single",pts:2,img:true,q:"Mrežni adapter je konfigurisan (Alternate config prikazana na slici: 172.30.30.5, maska 255.255.255.192, GW 172.30.30.60), spojen na svič bez DHCP servera. IP adresa koja će biti dodeljena je:",o:["169.254.218.132","172.30.30.5","0.0.0.0","192.168.0.10","172.30.30.60"],a:1},
  {id:20,type:"single",pts:2,img:true,q:"Korisnik ne može da pristupi Internetu sa PC1. Naredbe za testiranje (prikazano na slici) pokazuju da DNS server ne odgovara. Da bi se rešio problem potrebno je:",o:["promeniti adresu default gateway-а na PC1","promeniti subnet mask na PC1","promeniti adresu DNS-а na PC1"],a:2},
  {id:21,type:"single",pts:2,q:"Želite da napravite rezervnu kopiju sistema kako biste mogli da vratite prethodna podešavanja. Da biste ovo postigli potrebno je da:",o:["Napravite rezervnu kopiju datoteka korišćenjem Back Up Files u Backup And Restore Center","Napravite sliku (image) svog računara koristeći Create a system image u Backup And Restore prozoru","Napravite sliku svog računara koristeći System Repair tool","Napravite prethodnu verziju datoteka koristeći Shadow Copies"],a:1},
  {id:22,type:"single",pts:2,q:"Koristeći Performance Monitor ustanovili ste veliku aktivnost čvrstog diska. Da biste potvrdili da je disk usko grlo, morate analizirati rad i:",o:["procesora","mreže","memorije","aplikacija"],a:2},
  {id:23,type:"single",pts:2,q:"Korisnik asistent1 bezuspešno pokušava da pridruži računar PC1 domenu bookstore.com bez dobijanja dodatnih prava. Da bi ste ispunili zahteve:",o:["dodate korisnika asistent1 u grupu Server Operators","kreirajte na domenu bookstore.com računarski nalog PC1 i dozvolite korisniku asistent1 da pridruži računar domenu","dozvolite korisniku asistent1 lokalno prijavljanje koristeći grupne polise","dodate korisnika asistent1 u grupu Domain Administrators za kratko vreme"],a:1},
  {id:24,type:"single",pts:2,q:"Klijentu je otkazala integrisana mrežna kartica. Treba mu brzo i jeftino rešenje za rad od kuće. Rešenje koje će klijent najvjerovatnije prihvatiti:",o:["zamena matične ploče korišćenom koja podržava isti procesor i memoriju","zamena matične ploče novom pločom, nekompatibilnom sa procesorom i memorijom","instalacija nove mrežne kartice u slobodan PCIE slot","instalacija bežične mrežne kartice i nabavka bežičnog rutera"],a:3},
  {id:25,type:"single",pts:3,q:"Procesor podržava DDR3L-SDRAM i DDR4-SDRAM (1333,1600,2133,2400 MHz). Matična ploča podržava DDR4-SDRAM, 2 slota, max 32 GB. Optimalan memorijski modul za 8 GB je:",o:["8 GB DDR3L-SDRAM 1333 MHz","8 GB DDR3L-SDRAM 1600 MHz","8 GB DDR4-SDRAM 2133 MHz","8 GB DDR3L-SDRAM 2133 MHz","8 GB DDR4-SDRAM 1600 MHz","8 GB DDR4-SDRAM 2400 MHz"],a:2},
  {id:26,type:"single",pts:3,img:true,q:"Radnik Milan (nalog milan, član grupe Nastavnici) koristi PC1. Za folder zadaci dozvole su prikazane na slici (Share: Everyone-Read; NTFS: Nastavnici-Modify). Kada Milan sa drugog računara pokuša da pristupi folderu zadaci, Milan:",o:["će moći da otvori folder i menja sadržaj foldera","neće moći da otvori folder","će moći da otvori, ali neće moći da menja sadržaj foldera"],a:2},
  {id:27,type:"single",pts:3,q:"PC1 (IP 10.11.11.1, SM /25) pinguuje PC2 uspešno, ali PC2 ne može da pinguuje PC1 (timeout). Uzrok je:",o:["mrežni kabl kojim je PC1 povezan na svič je neispravan","IP adrese ovim računarima nisu dobro dodeljene","unutar firewall-а na PC2 je pravilo koje blokira dolazne ICMP pakete","unutar firewall-а na PC1 je pravilo koje blokira dolazne ICMP pakete","mrežni kabl kojim je PC2 povezan na svič je neispravan"],a:3},
  {id:28,type:"single",pts:3,img:true,q:"Na električnoj šemi potenciometar P (1 KOhm) se prebacuje iz položaja 1 u položaj 2. Šta se dešava sa svetlećom diodom D?",o:["dioda svetli jačim intenzitetom","intenzitet svetlosti diode zavisi od programa u mikrokontroleru","dioda neće svetleti"],a:1},

  {id:29,type:"multi",pts:2,q:"Laptop se isključio i ostao bez napajanja, uprkos priključenom punjaču. Postupak otkrivanja uzroka problema započnite:",o:["Prijavom problema nadležnom servisu","Pretpostavkom da je otkazao punjač baterije","Pretpostavkom da je otkazao hard disk","Priključenjem punjača drugog laptopa"],ma:[1,3]},
  {id:30,type:"multi",pts:2,q:"Kao antivirusni programi mogu da se koriste:",o:["KASPER","NORTON COMMANDER","AVAST","AGV","NOD32"],ma:[2,4]},
  {id:31,type:"multi",pts:2,q:"U osnovne elemente tehničkog crteža NE spadaju:",o:["skica tehničkog crteža","okvir crteža","radni zadatak","zaglavlje"],ma:[0,2]},
  {id:32,type:"multi",pts:3,q:"Osobine jezgra operativnog sistema su:",o:["Jezgro ne koristi rutine već ih predaje aplikacijama","U slojivitom modelu jezgro je najbliže hardveru","Deo jezgra su aplikacioni programi koji se izvršavaju","Jezgro određuje kada i na koje vreme će proces dobiti procesor","Deo jezgra su rutine za interprocesnu komunikaciju","U slojivitom modelu jezgro je najbliže aplikacijama"],ma:[1,3,4]},
  {id:33,type:"multi",pts:3,q:"Vizuelnom proverom komponenti računara možemo naslutiti uzroke kvarova. Moguće vidljive neispravnosti su:",o:["Nedostatak šrafova za pričvršćivanje hard diskova","Deformacije pinova na podnožju procesora","Zaprljanost kućišta","Nedostatak kabla koji povezuje procesor i operativnu memoriju","Da li su komponente pravilno postavljene u svoje slotove","Pregled stanja kondenzatora"],ma:[1,4,5]},

  {id:34,type:"fill",pts:2,q:"Kod tehnike virtualizacije, operativni sistem koji komunicira sa osnovnim hardverom naziva se ___, a operativni sistem koji je instaliran na virtuelnoj mašini naziva se ___.",slots:["OS koji komunicira sa hardverom","OS na virtuelnoj mašini"],answers:["host","guest"]},
  {id:35,type:"fill",pts:2,q:"Ne možete pristupiti veb sajtu po imenu domena, ali ping na IP radi. Problem je u DNS kešu. Komanda u command prompt-u je:\n\nipconfig /___",slots:["komanda posle /"],answers:["flushdns"]},
  {id:36,type:"fill",pts:3,q:"Merenja napona: 10,4V(×1), 9,6V(×1), 10,0V(×2), 10,1V(×4), 10,3V(×2).\nSrednja vrednost = 10,1 V.\n\nKoliko iznosi napon pri čijem merenju je napravljena najveća greška?",slots:["napon u V"],answers:["9,6"]},

  {id:37,type:"match",pts:2,q:"Povežite pojmove sa objašnjenjima (upišite broj pojma ispred objašnjenja):",left:["1. popravljivost (serviceability)","2. pouzdanost (reliability)","3. redundantnost (redundancy)","4. raspoloživost (availability)"],right:["verovatnoća da će sistem raditi korektno u intervalu [t1,t2] pod uslovom da je radio korektno u t1","verovatnoća da 'pokvareni' sistem može biti doveden u operativno stanje unutar vremenskog perioda t","verovatnoća da sistem radi korektno i da je na raspolaganju da izvrši funkcije u vremenskom trenutku t","dodavanje informacija podacima radi detekcije, maskiranja ili tolerancije kvara"],cp:[0,1,3,2]},
  {id:38,type:"match",pts:2,q:"Povežite objekte aktivnog direktorijuma sa karakteristikama:",left:["1. grupa (group)","2. korisnik (user)","3. kontakt (contact)","4. organizaciona jedinica (OU)"],right:["omogućava prijavu na domen","omogućava upravljanje objektima kolektivno umesto pojedinačno","objekat koji nema nikakve bezbednosne dozvole","koristi se za prikupljanje objekata koji dele zajedničke zahteve za administriranje"],cp:[1,0,2,3]},
  {id:39,type:"match",pts:2,q:"Povežite vrste rezervnih kopija sa opisima:",left:["1. Full backup","2. Incremental backup","3. Differential backup","4. Schedule backup"],right:["kopira samo promene u odnosu na poslednju rezervnu kopiju bilo kog tipa","pokreće se u određenom vremenskom intervalu","prvi put kopira sve; svaki sledeći put kopira promene u odnosu na prvu kopiju","kopira sve podatke sa zadate lokacije na zadato odredište"],cp:[3,0,2,1]},
  {id:40,type:"match",pts:2,q:"Upišite redni broj simbola koji odgovara nazivu električne komponente (1 = Zener simbol, 2 = LED simbol, 3 = Foto simbol):",left:["Zener dioda","LED dioda","Foto dioda"],right:["Zener dioda","LED dioda","Foto dioda"],cp:[1,0,2]},
  {id:41,type:"match",pts:3,q:"Povežite boje provodnika sa naponima (upišite redni broj boje provodnika):",left:["1. zelena","2. plava","3. crvena","4. narandžasta","5. crna","6. žuta"],right:["+12 V","+ 5 V","+3.3 V","GND","PC_ON","-12 V"],cp:[5,1,2,3,4,0]},
  {id:42,type:"match",pts:3,img:true,q:"A/D konverzija se odvija u 3 bloka (prikazano na slici). Upišite broj bloka koji odgovara koraku:",left:["Blok 1","Blok 2","Blok 3"],right:["Odmeravanje","Kvantizacija","Kodiranje"],cp:[0,1,2]},
  {id:43,type:"match",pts:3,q:"Povežite kombinacije tastera sa funkcijama (upišite redni broj kombinacije):",left:["1. Windows+M","2. Alt+Tab","3. Alt+Prtsc","4. Ctrl+X","5. Windows+E","6. Shift+Alt"],right:["Kretanje iz jedne otvorene aplikacije u drugu","Otvara program File Explorer","Minimizuje sve otvorene prozore","Cut – pri premeštanju fajlova i foldera","Prelazak na drugi jezik na tastaturi","Kopira sadržaj aktivnog prozora u Clipboard"],cp:[1,4,0,3,5,2]},
  {id:44,type:"match",pts:3,q:"Povežite nazive zlonamernog softvera sa opisima (upišite redni broj):",left:["1. Trojanski konji","2. Virusi","3. Crvi"],right:["Modifikuju razne fajlove i degradiraju performanse računara","Razmnožavaju se samprenosom sa računara na računar","Predstavljaju se kao koristan softver pa ih korisnik sam instalira"],cp:[1,2,0]},
  {id:45,type:"match",pts:3,img:true,q:"Na slici je TCP/IPv4 prozor. Polja za unos su označena brojevima 1–5. Upišite broj polja za svaki parametar:",left:["IP adresa","DNS2","SM","DG","DNS1"],right:["IP adresa","DNS2","SM","DG","DNS1"],cp:[0,4,1,2,3]},
  {id:46,type:"match",pts:3,q:"Povežite napade sa opisima. Napadi: 1=Spam, 2=Ransomware, 3=Code injection, 4=Trojan horse, 5=Sniffers, 6=DoS/DDoS",left:["1. Spam","2. Ransomware","3. Code injection","4. Trojan horse","5. Sniffers","6. DoS/DDoS"],right:["Vrsta napada kojim se maliciozni kod ubacuje preko ranjivih delova sajta ili kroz URL","Ucenjivački napad koji podrazumeva nasilno šifrovanje sadržaja žrtve uz zahtev za isplatu","Vrsta napada koja podrazumeva zagušenje servera zahtevima za pristup određenom resursu"],cp:[2,1,5]},

  {id:47,type:"order",pts:3,q:"Poređajte simptome prema prvom koraku dijagnostike (korak 1→4):\n1=Proveriti ventilator  2=Strana tela/HDD  3=Multimetrom napajanje  4=Proveriti modul",items:["Računar se pregreva i isključuje","Napajanje je postavljeno ali se računar uporno gasi","Nedavno instalirani memorijski modul se ne vidi","Glasni i neobični zvuci klikanja iz kućišta"],labels:["→ korak 1","→ korak 3","→ korak 4","→ korak 2"],co:[0,1,2,3]},
  {id:48,type:"order",pts:3,q:"Poređajte korake za automatsko kreiranje sadržaja dokumenta u Word-u hronološkim redosledom:",items:["Izbor formata za prikazivanje sadržaja","Označavanje brojeva stranica","Unutar References izabrati Table of Contents","Postavljanje pokazivača na mesto gde se predviđa sadržaj","Izbor i formatiranje naslova i podnaslova"],co:[4,0,3,2,1]},
  {id:49,type:"order",pts:3,q:"Poređajte projekte u svesci tehničke dokumentacije prema propisanom redosledu:",items:["Spoljno uređenje (pejzažna arhitektura i hortikultura)","Arhitektura","Konstrukcija i drugi građevinski projekti","Pripremni radovi (rušenje, zemljani radovi)","Hidrotehničke instalacije","Telekomunikacione i signalne instalacije","Elektroenergetske instalacije","Mašinske instalacije","Saobraćaj i saobraćajna signalizacija","Tehnologija"],co:[1,2,9,3,4,5,6,7,8,0]},

  {id:50,type:"match",pts:4,q:"Povežite strukture sistema datoteka sa opisima:",left:["1. Kontrolne strukture za alokaciju datoteka","2. VCB (boot control block)","3. Kontrolni blok particije (PCB)","4. Kontrolni blokovi datoteka (FCB)"],right:["sadrži informacije o sistemu datoteka","sadrži atribute datoteka i ukazivače na alokaciju datoteke","sadrži informacije potrebne za podizanje operativnog sistema","određuju konkretan sadržaj datoteke (blokove u kojima je smešten sadržaj)"],cp:[2,3,1,0]},
];

const SKALA = [{min:87.5,g:5,l:"Odličan"},{min:75.5,g:4,l:"Vrlo dobar"},{min:63.5,g:3,l:"Dobar"},{min:50.5,g:2,l:"Dovoljan"},{min:0,g:1,l:"Nedovoljan"}];
const getOc = p => SKALA.find(s=>p>=s.min)||SKALA[4];
const totalPts = qs.reduce((s,q)=>s+q.pts,0);

const C = {
  ok:   {bg:"#d4edda", border:"#28a745", text:"#155724"},
  err:  {bg:"#f8d7da", border:"#dc3545", text:"#721c24"},
  sel:  {bg:"#cce5ff", border:"#004085", text:"#004085"},
  idle: {bg:"#f8f9fa", border:"#ced4da", text:"#212529"},
  part: {bg:"#fff3cd", border:"#fd7e14", text:"#856404"},
};

function ImgBox({id}) {
  const src = IMGS[id];
  if (src) return <img src={src} alt={`Slika za pitanje ${id}`} style={{width:"100%",borderRadius:6,marginBottom:10,border:"1px solid #dee2e6"}}/>;
  return (
    <div style={{background:"#f0f4f8",border:"1.5px dashed #adb5bd",borderRadius:8,padding:14,marginBottom:10,textAlign:"center",color:"#6c757d",fontSize:13}}>
      <div style={{fontSize:20,marginBottom:4}}>🖼️</div>
      <strong>Slika za pitanje {id}</strong><br/>
      <span style={{fontSize:12}}>Dodajte putanju slike u IMGS objekat na vrhu fajla</span>
    </div>
  );
}

function Badge({children, color="gray"}) {
  const colors = {gray:{bg:"#f0f0f0",c:"#495057"},blue:{bg:"#e3f2fd",c:"#0d47a1"},green:{bg:"#e8f5e9",c:"#1b5e20"},orange:{bg:"#fff3e0",c:"#e65100"},purple:{bg:"#f3e5f5",c:"#4a148c"},pink:{bg:"#fce4ec",c:"#880e4f"}};
  const s = colors[color]||colors.gray;
  return <span style={{fontSize:11,fontWeight:700,background:s.bg,color:s.c,padding:"2px 8px",borderRadius:20}}>{children}</span>;
}

function OptBtn({state="idle", onClick, disabled, children}) {
  const s = C[state];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,
        cursor:disabled?"default":"pointer",fontSize:14,width:"100%",textAlign:"left",
        fontFamily:"inherit",background:s.bg,border:`1.5px solid ${s.border}`,color:s.text,
        transition:"opacity 0.1s"}}
    >
      {children}
    </button>
  );
}

function SingleQ({q, val, setVal, done}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {q.o.map((opt,i) => {
        let state = "idle";
        if (done) { if (i===q.a) state="ok"; else if (val===i) state="err"; }
        else if (val===i) state="sel";
        return (
          <OptBtn key={i} state={state} onClick={()=>setVal(i)} disabled={done}>
            <span style={{fontWeight:700,minWidth:22,flexShrink:0}}>{i+1}.</span>
            <span style={{flex:1}}>{opt}</span>
            {done && i===q.a && <span style={{fontWeight:700,fontSize:18,color:C.ok.text}}>✓</span>}
            {done && val===i && i!==q.a && <span style={{fontWeight:700,fontSize:18,color:C.err.text}}>✗</span>}
          </OptBtn>
        );
      })}
    </div>
  );
}

function MultiQ({q, val=[], setVal, done}) {
  const toggle = i => setVal(val.includes(i) ? val.filter(x=>x!==i) : [...val,i]);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{fontSize:12,color:"#6c757d",marginBottom:2}}>Izaberite sve tačne odgovore</div>
      {q.o.map((opt,i) => {
        const isC=q.ma.includes(i), isSel=val.includes(i);
        let state="idle";
        if (done) { if (isC) state="ok"; else if (isSel) state="err"; }
        else if (isSel) state="sel";
        return (
          <OptBtn key={i} state={state} onClick={()=>toggle(i)} disabled={done}>
            <span style={{fontWeight:700,minWidth:22,flexShrink:0}}>{i+1}.</span>
            <span style={{flex:1}}>{opt}</span>
            {done && isC  && <span style={{fontWeight:700,fontSize:18,color:C.ok.text}}>✓</span>}
            {done && isSel && !isC && <span style={{fontWeight:700,fontSize:18,color:C.err.text}}>✗</span>}
          </OptBtn>
        );
      })}
    </div>
  );
}

function FillQ({q, val={}, setVal, done}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {q.slots.map((slot,i) => {
        const v=val[i]||"", correct=q.answers[i];
        const ok=done && v.trim().toLowerCase()===correct.trim().toLowerCase();
        const err=done && !ok;
        return (
          <div key={i}>
            <div style={{fontSize:13,color:"#495057",marginBottom:5,fontWeight:500}}>{slot}:</div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <input value={v} disabled={done}
                onChange={e=>setVal({...val,[i]:e.target.value})}
                style={{padding:"8px 12px",borderRadius:6,fontSize:14,minWidth:180,fontFamily:"inherit",
                  border:done?(ok?`2px solid ${C.ok.border}`:`2px solid ${C.err.border}`):"1.5px solid #ced4da",
                  background:done?(ok?C.ok.bg:C.err.bg):"white",
                  color:done?(ok?C.ok.text:C.err.text):"#212529"}}/>
              {done && <span style={{fontSize:13,fontWeight:600,color:ok?C.ok.text:C.err.text}}>
                {ok ? "✓ Tačno" : `✗  Tačan: ${correct}`}
              </span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MatchQ({q, val={}, setVal, done}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{fontSize:12,color:"#6c757d",marginBottom:2}}>Upišite redni broj pojma ispred odgovarajućeg opisa:</div>
      {q.right.map((desc,i) => {
        const v=val[i]||"", correct=q.cp[i]+1;
        const ok=done && parseInt(v)===correct;
        const err=done && !ok;
        return (
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",borderRadius:8,
            border:`1.5px solid ${done?(ok?C.ok.border:C.err.border):"#dee2e6"}`,
            background:done?(ok?C.ok.bg:C.err.bg):"#f8f9fa"}}>
            <input type="number" min="1" max={q.left.length} value={v} disabled={done}
              onChange={e=>setVal({...val,[i]:e.target.value})}
              style={{width:56,padding:"5px 8px",borderRadius:6,border:"1.5px solid #ced4da",
                fontSize:14,textAlign:"center",flexShrink:0,background:"white",fontFamily:"inherit"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,color:done?(ok?C.ok.text:C.err.text):"#212529"}}>{desc}</div>
              {done && err && (
                <div style={{fontSize:12,color:C.err.text,marginTop:4,fontWeight:600}}>
                  Tačan: {correct}. {q.left[q.cp[i]]}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <details style={{marginTop:2}}>
        <summary style={{fontSize:13,color:"#6c757d",cursor:"pointer",userSelect:"none"}}>Prikaži listu pojmova ▾</summary>
        <div style={{padding:"8px 12px",background:"#e9ecef",borderRadius:8,marginTop:4}}>
          {q.left.map((item,i)=><div key={i} style={{fontSize:13,padding:"3px 0",color:"#212529"}}>{item}</div>)}
        </div>
      </details>
    </div>
  );
}

function OrderQ({q, val, setVal, done}) {
  const order = val && val.length ? val : q.items.map((_,i)=>i);
  const move = (from,to) => { const n=[...order]; const [r]=n.splice(from,1); n.splice(to,0,r); setVal(n); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {!done && <div style={{fontSize:12,color:"#6c757d",marginBottom:2}}>Koristite ↑↓ za poređavanje:</div>}
      {order.map((itemIdx,pos) => {
        const label = q.labels ? q.labels[itemIdx] : "";
        const isOk = done && q.co[pos]===itemIdx;
        const isErr = done && !isOk;
        return (
          <div key={itemIdx} style={{display:"flex",gap:8,alignItems:"center",padding:"10px 14px",borderRadius:8,
            border:`1.5px solid ${done?(isOk?C.ok.border:C.err.border):"#dee2e6"}`,
            background:done?(isOk?C.ok.bg:C.err.bg):"#f8f9fa"}}>
            <span style={{fontWeight:700,minWidth:26,color:"#6c757d",flexShrink:0}}>{pos+1}.</span>
            <span style={{flex:1,fontSize:14,color:done?(isOk?C.ok.text:C.err.text):"#212529"}}>
              {q.items[itemIdx]}
              {label && <span style={{marginLeft:8,color:"#888",fontStyle:"italic",fontSize:13}}>{label}</span>}
            </span>
            {done && isErr && <span style={{fontSize:12,color:C.err.text,whiteSpace:"nowrap",flexShrink:0}}>→ poz. {q.co.indexOf(itemIdx)+1}</span>}
            {!done && (
              <div style={{display:"flex",gap:3,flexShrink:0}}>
                {["↑","↓"].map((arrow,di) => {
                  const disabled = di===0 ? pos===0 : pos===order.length-1;
                  return (
                    <button key={arrow} onClick={()=>!disabled && move(pos, pos+(di===0?-1:1))}
                      style={{padding:"3px 9px",borderRadius:4,border:"1.5px solid #ced4da",
                        background:"white",cursor:disabled?"default":"pointer",fontSize:13,
                        opacity:disabled?0.3:1,fontFamily:"inherit"}}>
                      {arrow}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function calcScore(q, ans) {
  if (ans===undefined||ans===null) return 0;
  if (q.type==="single") return ans===q.a ? q.pts : 0;
  if (q.type==="multi") {
    const sel=ans||[], cor=q.ma;
    if (!sel.length) return 0;
    if (sel.some(s=>!cor.includes(s))) return 0;
    return Math.round(sel.filter(s=>cor.includes(s)).length/cor.length*q.pts*2)/2;
  }
  if (q.type==="fill") {
    const n=q.slots.length;
    const hits=q.slots.filter((_,i)=>(ans&&ans[i]||"").trim().toLowerCase()===q.answers[i].trim().toLowerCase()).length;
    return Math.round(hits/n*q.pts*10)/10;
  }
  if (q.type==="match") {
    const n=q.right.length;
    const hits=q.right.filter((_,i)=>parseInt((ans||{})[i])===q.cp[i]+1).length;
    return Math.round(hits/n*q.pts*4)/4;
  }
  if (q.type==="order") {
    const ord=ans&&ans.length?ans:q.items.map((_,i)=>i);
    return ord.every((v,i)=>q.co[i]===v)?q.pts:0;
  }
  return 0;
}

const typeLabel = {single:"Jedan odgovor",multi:"Više odgovora",fill:"Dopuni",match:"Poveži",order:"Poređaj"};
const typeBadge = {single:"blue",multi:"pink",fill:"green",match:"orange",order:"purple"};

export default function App() {
  const [page, setPage] = useState("start");
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const setA = useCallback((id,v) => setAns(prev=>({...prev,[id]:v})),[]);

  const scores = done ? qs.map(q=>calcScore(q,ans[q.id])) : null;
  const total = scores ? scores.reduce((a,b)=>a+b,0) : 0;
  const pct = done ? Math.round(total/totalPts*100) : 0;
  const oc = done ? getOc(pct) : null;

  if (page==="start") return (
    <div style={{padding:"2rem 1.5rem",maxWidth:580,margin:"0 auto",textAlign:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"#6c757d",marginBottom:10,textTransform:"uppercase"}}>Електротехничар рачунара</div>
      <h1 style={{fontSize:26,fontWeight:700,margin:"0 0 6px",color:"#212529"}}>Матурски испит — Јун</h1>
      <p style={{color:"#6c757d",fontSize:15,marginBottom:28}}>Испит за проверу стручно-теоријских знања</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
        {[["50","питања"],["100","бодова"],["5","типова"]].map(([v,l])=>(
          <div key={l} style={{background:"#f8f9fa",borderRadius:10,padding:"14px 8px",border:"1.5px solid #dee2e6"}}>
            <div style={{fontSize:28,fontWeight:800,color:"#212529"}}>{v}</div>
            <div style={{fontSize:12,color:"#6c757d"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#f8f9fa",borderRadius:10,padding:16,marginBottom:28,textAlign:"left",border:"1.5px solid #dee2e6"}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8,color:"#495057"}}>Скала оцена:</div>
        {[{r:"87,5–100",g:5,l:"Одличан"},{r:"75,5–87,4",g:4,l:"Врло добар"},{r:"63,5–75,4",g:3,l:"Добар"},{r:"50,5–63,4",g:2,l:"Довољан"},{r:"0–50",g:1,l:"Недовољан"}].map(s=>(
          <div key={s.g} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"1px solid #e9ecef",color:"#495057"}}>
            <span style={{fontWeight:600}}>{s.l} ({s.g})</span>
            <span style={{color:"#6c757d"}}>{s.r} бодова</span>
          </div>
        ))}
      </div>
      <button onClick={()=>setPage("quiz")}
        style={{background:"#212529",color:"#fff",border:"none",borderRadius:10,padding:"14px 44px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Започни тест →
      </button>
    </div>
  );

  return (
    <div style={{maxWidth:740,margin:"0 auto",padding:"0 10px 40px",fontFamily:"system-ui,sans-serif"}}>

      {/* Sticky header */}
      <div style={{position:"sticky",top:0,background:"white",zIndex:100,borderBottom:"2px solid #dee2e6",
        padding:"10px 4px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:16}}>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:"#212529"}}>ЕТР Матурски испит — Јун</div>
          <div style={{fontSize:12,color:"#6c757d"}}>50 питања • 100 бодова</div>
        </div>
        {!done ? (
          <button onClick={()=>setShowConfirm(true)}
            style={{background:"#212529",color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",
              fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Предај тест
          </button>
        ) : (
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:24,fontWeight:800,color:pct>=50?C.ok.text:C.err.text}}>{total.toFixed(1)}/{totalPts}</div>
            <div style={{fontSize:13,color:"#6c757d"}}>{pct}% • Оцена {oc.g} — {oc.l}</div>
          </div>
        )}
      </div>

      {/* Modal za potvrdu — bez window.confirm */}
      {showConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"white",borderRadius:12,padding:28,maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:22,marginBottom:10}}>📋</div>
            <div style={{fontWeight:700,fontSize:17,marginBottom:8,color:"#212529"}}>Predati test?</div>
            <div style={{fontSize:14,color:"#6c757d",marginBottom:20}}>
              Odgovorili ste na {Object.keys(ans).length} od 50 pitanja.<br/>Nakon predaje nećete moći da menjate odgovore.
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>setShowConfirm(false)}
                style={{padding:"10px 24px",borderRadius:8,border:"1.5px solid #ced4da",background:"white",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit"}}>
                Otkaži
              </button>
              <button onClick={()=>{setDone(true);setShowConfirm(false);}}
                style={{padding:"10px 24px",borderRadius:8,border:"none",background:"#212529",color:"white",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>
                Predaj ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rezultat baner */}
      {done && (
        <div style={{background:pct>=50?C.ok.bg:C.err.bg,border:`2px solid ${pct>=50?C.ok.border:C.err.border}`,
          borderRadius:12,padding:16,marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:17,color:pct>=50?C.ok.text:C.err.text,marginBottom:4}}>Резултат теста</div>
          <div style={{fontSize:14,color:pct>=50?C.ok.text:C.err.text}}>
            Тачно: {scores.filter((s,i)=>s===qs[i].pts).length}/{qs.length} питања &nbsp;|&nbsp;
            Бодова: {total.toFixed(1)}/{totalPts} &nbsp;|&nbsp;
            Оцена: <strong>{oc.g} — {oc.l}</strong>
          </div>
          {qs.some((_,i)=>scores[i]<qs[i].pts) && (
            <div style={{fontSize:13,color:"#495057",marginTop:6}}>
              Нетачно/делимично: питања {qs.filter((_,i)=>scores[i]<qs[i].pts).map(q=>q.id).join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Pitanja */}
      {qs.map((q,idx) => {
        const sc = done ? scores[idx] : null;
        const isOk = done && sc===q.pts;
        const isPartial = done && sc>0 && sc<q.pts;
        const bc = done ? (isOk?C.ok.border : isPartial?C.part.border : C.err.border) : "#dee2e6";
        const bgHeader = done ? (isOk?C.ok.bg : isPartial?C.part.bg : C.err.bg) : "#f8f9fa";

        return (
          <div key={q.id} style={{marginBottom:14,background:"white",borderRadius:12,border:`2px solid ${bc}`,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0",display:"flex",gap:10,alignItems:"flex-start",background:bgHeader}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:7,flexWrap:"wrap",alignItems:"center"}}>
                  <Badge color="gray">#{q.id}</Badge>
                  <Badge color={typeBadge[q.type]}>{typeLabel[q.type]}</Badge>
                  <Badge color="green">{q.pts} bod{q.pts===1?"":"a"}</Badge>
                </div>
                <div style={{fontSize:14,lineHeight:1.7,color:"#212529",whiteSpace:"pre-line"}}>{q.q}</div>
              </div>
              {done && (
                <div style={{textAlign:"center",minWidth:50,flexShrink:0}}>
                  <div style={{fontSize:22,fontWeight:800,color:isOk?C.ok.text:isPartial?C.part.text:C.err.text}}>
                    {sc%1===0?sc:sc.toFixed(1)}
                  </div>
                  <div style={{fontSize:11,color:"#6c757d"}}>/{q.pts}</div>
                </div>
              )}
            </div>
            <div style={{padding:"14px 16px"}}>
              {q.img && <ImgBox id={q.id}/>}
              {q.type==="single" && <SingleQ q={q} val={ans[q.id]} setVal={v=>setA(q.id,v)} done={done}/>}
              {q.type==="multi"  && <MultiQ  q={q} val={ans[q.id]} setVal={v=>setA(q.id,v)} done={done}/>}
              {q.type==="fill"   && <FillQ   q={q} val={ans[q.id]} setVal={v=>setA(q.id,v)} done={done}/>}
              {q.type==="match"  && <MatchQ  q={q} val={ans[q.id]} setVal={v=>setA(q.id,v)} done={done}/>}
              {q.type==="order"  && <OrderQ  q={q} val={ans[q.id]} setVal={v=>setA(q.id,v)} done={done}/>}
            </div>
          </div>
        );
      })}

      <div style={{textAlign:"center",paddingTop:16}}>
        {!done ? (
          <button onClick={()=>setShowConfirm(true)}
            style={{background:"#212529",color:"#fff",border:"none",borderRadius:10,padding:"14px 44px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Предај тест
          </button>
        ) : (
          <button onClick={()=>{setAns({});setDone(false);window.scrollTo(0,0);}}
            style={{border:"2px solid #212529",background:"white",borderRadius:10,padding:"12px 32px",fontSize:14,fontWeight:700,cursor:"pointer",color:"#212529",fontFamily:"inherit"}}>
            ↺ Почни поново
          </button>
        )}
      </div>
    </div>
  );
}
