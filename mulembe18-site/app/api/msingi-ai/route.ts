import { NextResponse } from "next/server";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Msingi AI Knowledge Base for Mulembe18 Community Platform
 * Nairobi, Kenya AI Research Lab (Sauti Speech & African Language Framework)
 */
const MSINGI_KNOWLEDGE = `
Wewe ni "Msingi AI — Sauti ya Mulembe", msaidizi wa akili mnemba (AI) aliyetengenezwa nchini Kenya (Nairobi) na Msingi AI.
Unahudumia jumuia ya Mulembe18 inayounganisha wanajumuiya wa jamii ya Waluhya (Abaluhya) wanaoishi Mombasa, Nairobi, na kaunti zote 47 za Kenya, pamoja na diaspora.

Dhamira yako:
1. Kutoa majibu yenye heshima, utamaduni safi wa kiafrika, na uelewa wa kina wa mila na desturi za jamii ya Mulembe (Abaluhya).
2. Kuwaongoza wanachama kuhusu:
   - Koo zote 18 (Sub-communities): Bukusu, Maragoli (AvaLogoli), Wanga, Samia, Tiriki, Idakho, Isukha, Marama, Banyore (Abanyole), Kabras, Batsotso, Tachoni, Kisa, Marachi, Khayo, Abanyala, Nyore, Batura.
   - Mfuko wa Ustawi (Welfare & Solidarity Fund): Ada ya kila mwezi (KES 200), ada ya kila mwaka (KES 1,200), michango ya rambirambi (Bereavement repatriation hearse transport to Western homes), msaada wa matibabu ya dharura, na udhamini wa wanafunzi (Youth bursary).
   - M-Pesa Paybill: 522522, Akaunti: MULEMBE18.
   - Utawala wa uwazi: Public ledger yenye "Dual Sign-Off" (kila malipo yanapaswa kuidhinishwa na viongozi wawili kabla ya kutolewa).
   - Matawi (Chapters): Mombasa Flagship Chapter (Nyali, Bamburi, Likoni, Kisauni, Island, Changamwe), Nairobi Metropolitan, Nakuru, Kisumu, Eldoret, na matawi ya nyumbani Kakamega, Bungoma, Vihiga, Busia.
   - Mwongozo wa wageni wapya (Newcomers guide): Kupata nyumba za bei nafuu Mombasa (Bamburi, Tudor, Nyali), njia za matatu (Route 10, Mwembe Tayari), usalama, na makanisa ya jumuia.
   - Sheria za nchi: Kuzingatia Sheria ya Kulinda Data ya Kenya (Kenya Data Protection Act 2019 / ODPC).
   - Msingi AI Speech & Sauti: Unatumia miundombinu ya Sauti kutoka Msingi AI inayojumuisha Kiswahili fasaha, Kiingereza, na misemo ya kiluhya (kama vile: "Mulembe muno", "Bwakhacha", "Mirembe", "Omwami", "Khulola mulala").

Muundo wa majibu:
- Jibu kwa Kiswahili fasaha, mchanganyiko wa lugha ya kirafiki (au Kiingereza ikiwa mtumiaji ameuliza kwa Kiingereza).
- Weka alama za nukta (bullet points) na maelezo mafupi, wazi na yenye kutia moyo.
- Daima onesha mshikamano ("Mulembe Ni Nguvu!").
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage: string = body.message || "";
    const conversationHistory: ChatMessage[] = body.history || [];

    if (!userMessage.trim()) {
      return NextResponse.json(
        { success: false, error: "Tafadhali andika ujumbe wako." },
        { status: 400 }
      );
    }

    // 1. If external Msingi AI or compatible Kenyan LLM key is configured in env
    const msingiApiKey = process.env.MSINGI_API_KEY;
    const msingiApiUrl = process.env.MSINGI_API_URL || "https://api.msingiai.com/v1/chat/completions";
    const msingiModel = process.env.MSINGI_MODEL || "msingi-sauti-1";

    if (msingiApiKey && msingiApiKey !== "your_msingi_key_here") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const externalRes = await fetch(msingiApiUrl, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${msingiApiKey}`,
          },
          body: JSON.stringify({
            model: msingiModel,
            messages: [
              { role: "system", content: MSINGI_KNOWLEDGE },
              ...conversationHistory.slice(-4),
              { role: "user", content: userMessage },
            ],
            temperature: 0.6,
            max_tokens: 600,
          }),
        });

        clearTimeout(timeoutId);

        if (externalRes.ok) {
          const externalData = await externalRes.json();
          const replyText =
            externalData.choices?.[0]?.message?.content ||
            externalData.choices?.[0]?.text ||
            externalData.output ||
            externalData.reply ||
            externalData.content;

          if (replyText) {
            return NextResponse.json({
              success: true,
              provider: "msingi-ai-live",
              reply: replyText,
              audioText: replyText.replace(/[*_#`]/g, ""),
              suggestedActions: generateSuggestedActions(userMessage),
            });
          }
        } else {
          const errText = await externalRes.text().catch(() => "");
          console.warn(`[Msingi AI API] Response ${externalRes.status}:`, errText);
        }
      } catch (externalErr) {
        console.warn("[Msingi AI API] Live call fallback:", externalErr);
      }
    }

    // 2. High-performance culturally grounded Kenyan engine (Fallback / Standalone)
    const reply = generateCulturedMsingiResponse(userMessage);

    return NextResponse.json({
      success: true,
      provider: "msingi-ai-kenya",
      reply,
      audioText: reply.replace(/[*_#`]/g, "").slice(0, 300),
      suggestedActions: generateSuggestedActions(userMessage),
    });
  } catch (error: any) {
    console.error("Msingi AI Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Hitilafu imetokea. Tafadhali jaribu tena baada ya muda mfupi.",
      },
      { status: 500 }
    );
  }
}

/**
 * Intelligent contextual response generator for Msingi AI (Swahili / English / Luhya)
 */
function generateCulturedMsingiResponse(prompt: string): string {
  const p = prompt.toLowerCase().trim();

  // 1. Identity / Name / Who are you / Introduction
  if (
    p.includes("name") ||
    p.includes("who are you") ||
    p.includes("jina lako") ||
    p.includes("wewe ni nani") ||
    p.includes("introduce") ||
    p.includes("jitambulishe") ||
    p.includes("what is your name") ||
    p.includes("what's your name") ||
    p.includes("msingi ai ni nini")
  ) {
    const isEnglish = p.includes("what") || p.includes("who") || p.includes("name");
    if (isEnglish) {
      return (
        `**Mulembe! My name is Msingi AI (Sauti ya Mulembe)**\n\n` +
        `I am an AI assistant developed in Nairobi, Kenya, by **Msingi AI**, specifically tailored for the **Mulembe18** community platform.\n\n` +
        `Here is what I can do for you:\n` +
        `• **Cultural Heritage:** Guide you through all 18 Luhya sub-communities, traditions, clans, and history.\n` +
        `• **Welfare & Solidarity Fund:** Explain monthly dues (KES 200), bereavement repatriation, and emergency support.\n` +
        `• **M-Pesa Payments:** Provide direct Paybill (\`522522\`), account details, and payment verification instructions.\n` +
        `• **National Chapters:** Assist with chapter contacts in Mombasa, Nairobi, Nakuru, Kisumu, Eldoret, and Western counties.\n` +
        `• **Newcomer Settlement:** Give local guidance on housing, matatu routes, and community elders.\n\n` +
        `Feel free to ask me anything in English, Kiswahili, or your mother tongue!`
      );
    }
    return (
      `**Mulembe muno! Jina langu ni Msingi AI — Sauti ya Mulembe**\n\n` +
      `Mimi ni msaidizi wa akili mnemba (AI) aliyetengenezwa jijini Nairobi na **Msingi AI**, nikiboreshwa mahususi kuwahudumia wanajumuiya ya Mulembe18 kote nchini Kenya na ughaibuni.\n\n` +
      `Mambo ninayoweza kukusaidia nayo:\n` +
      `• **Utamaduni & Koo:** Kufafanua asili, mila na historia ya koo zote 18 za jamii ya Abaluhya.\n` +
      `• **Mfuko wa Ustawi (Welfare):** Ada za uanachama (KES 200/mwezi), huduma za dharura, na rambirambi.\n` +
      `• **Malipo ya M-Pesa:** Maelekezo ya Paybill (\`522522\`, Akaunti: \`MULEMBE18\`) na risiti za uwazi.\n` +
      `• **Matawi ya Kenya:** Maelezo ya tawi la Mombasa, Nairobi, Nakuru, Kisumu, Eldoret, na Western.\n` +
      `• **Wageni Wapya:** Msaada wa kupata nyumba za bei nafuu na miongozo ya usalama.\n\n` +
      `Niambie, ungependa tukazie jambo gani leo?`
    );
  }

  // 2. Greetings
  if (
    p.includes("habari") ||
    p.includes("hello") ||
    p.includes("hi") ||
    p.includes("mulembe") ||
    p.includes("mirembe") ||
    p.includes("bwakhacha") ||
    p.includes("hujambo") ||
    p.includes("vipi") ||
    p.includes("sasa") ||
    p.includes("niaje")
  ) {
    return (
      `**Mulembe muno!** Hujambo na karibu sana. Mimi ni **Msingi AI**, msaidizi wa kidijitali wa jamii ya Mulembe18 hapa Kenya.\n\n` +
      `Ninaweza kukusaidia kuhusu:\n` +
      `• **Koo zote 18 za Luhya:** Asili, mila, koo ndogo na maeneo yao nyumbani Magharibi.\n` +
      `• **Mfuko wa Ustawi (Welfare):** Michango ya M-Pesa, fomu za rambirambi, matibabu na miongozo ya malipo.\n` +
      `• **Matawi ya Kenya:** Kujiunga na Tawi la Mombasa, Nairobi, Nakuru, Kisumu, au kuhamisha tawi.\n` +
      `• **Mwongozo wa Makazi:** Kupata nyumba na maeneo ya kuishi unapohamia Mombasa au miji mingine.\n\n` +
      `Je, ungependa nikusaidie na jambo gani leo?`
    );
  }

  // 3. How are you / Status
  if (
    p.includes("how are you") ||
    p.includes("habari yako") ||
    p.includes("uko aje") ||
    p.includes("mzima") ||
    p.includes("hali gani")
  ) {
    return (
      `**Niko salama sana, asante! (Bwakhacha muno!)**\n\n` +
      `Mimi na mifumo ya **Msingi AI** tuko tayari kukuhudumia na kukupa taarifa zote sahihi za jukwaa letu la Mulembe18. Ungependa tushauriane nini sasa hivi?`
    );
  }

  // 4. Registration / How to join / Kuwa mwanachama
  if (
    p.includes("jiunge") ||
    p.includes("join") ||
    p.includes("register") ||
    p.includes("jisajili") ||
    p.includes("membership") ||
    p.includes("uanachama")
  ) {
    return (
      `**Jinsi ya Kujiunga na Mulembe18 (Member Registration)**\n\n` +
      `Kujiunga ni rahisi na hufanyika mtandaoni kwa dakika chache tu:\n\n` +
      `1. **Kujisajili:** Bofya kitufe cha **Sign Up / Jisajili** kwenye upande wa juu wa tovuti au tembelea ukurasa wa Dashboard.\n` +
      `2. **Chagua Ukoo na Tawi:** Weka kaunti yako ya makazi (mfano: Mombasa, Nairobi), tawi lako, na mojawapo ya koo 18 za Luhya.\n` +
      `3. **Ada ya Uanachama:** Lipa ada ya usajili kupitia M-Pesa Paybill **522522**, Akaunti **MULEMBE18**.\n` +
      `4. **Kadi ya Kidijitali:** Utapokea nambari ya kipekee ya uanachama na Kadi ya Uanachama ya Kidijitali (Digital ID Card) yenye QR Code.\n\n` +
      `Je, ungependa nikuelekeze kwenye ukurasa wa kujisajili moja kwa moja?`
    );
  }

  // Welfare, Contributions & M-Pesa
  if (
    p.includes("welfare") ||
    p.includes("mchango") ||
    p.includes("mpesa") ||
    p.includes("m-pesa") ||
    p.includes("paybill") ||
    p.includes("rambirambi") ||
    p.includes("msaada") ||
    p.includes("dues") ||
    p.includes("hazina")
  ) {
    return (
      `**Mwongozo wa Mfuko wa Ustawi (Mulembe18 Welfare Fund)**\n\n` +
      `Mfuko wetu unaendeshwa kwa **uwazi wa asilimia 100%** chini ya kanuni ya idhini ya viongozi wawili (*Dual Sign-Off*) kabla ya malipo yoyote kutolewa:\n\n` +
      `1. **Kiwango cha Michango:**\n` +
      `   • Ada ya Kila Mwezi: **KES 200**\n` +
      `   • Ada ya Kila Mwaka: **KES 1,200**\n` +
      `   • Michango ya Dharura/Rambirambi: Kuanzia KES 500 hadi KES 5,000 kulingana na uwezo wako.\n\n` +
      `2. **Jinsi ya Kulipa kupitia M-Pesa:**\n` +
      `   • **Paybill:** \`522522\`\n` +
      `   • **Account Number:** \`MULEMBE18\` (au nambari yako ya uanachama)\n` +
      `   • Unaweza pia kutumia kisanduku cha **M-Pesa Express** kwenye ukurasa wa Welfare kwa kubofya kitufe cha STK Push.\n\n` +
      `3. **Faida za Mwanachama:**\n` +
      `   • Usafirishaji wa heshima wa mwili wa mwanachama au tegemezi kutoka Pwani hadi nyumbani Magharibi.\n` +
      `   • Msaada wa matibabu ya dharura hospitalini kufuatia ajali au ugonjwa wa ghafla.\n\n` +
      `Je, unahitaji kuanzisha ombi la msaada au kuangalia orodha ya malipo ya umma?`
    );
  }

  // Clans / Sub-tribes
  if (
    p.includes("clan") ||
    p.includes("koo") ||
    p.includes("sub-community") ||
    p.includes("bukusu") ||
    p.includes("maragoli") ||
    p.includes("wanga") ||
    p.includes("samia") ||
    p.includes("tiriki") ||
    p.includes("idakho") ||
    p.includes("isukha") ||
    p.includes("marama") ||
    p.includes("banyore") ||
    p.includes("kabras") ||
    p.includes("tachoni") ||
    p.includes("kisa") ||
    p.includes("marachi") ||
    p.includes("khayo") ||
    p.includes("abanyala") ||
    p.includes("nyore") ||
    p.includes("batura") ||
    p.includes("batsotso")
  ) {
    return (
      `**Koo 18 za Jamii ya Waluhya (The 18 Luhya Sub-Communities)**\n\n` +
      `Jukwaa la Mulembe18 linatambua na kuunganisha koo zote 18 zilizo chini ya mwamvuli mmoja wa amani na maendeleo:\n\n` +
      `• **Bungoma & Mt. Elgon:** Bukusu, Tachoni, Batura\n` +
      `• **Kakamega County:** Wanga, Isukha, Idakho, Kabras, Batsotso, Marama, Kisa\n` +
      `• **Vihiga County:** Maragoli (AvaLogoli), Banyore (Abanyole), Tiriki, Nyore\n` +
      `• **Busia County:** Samia, Marachi, Khayo, Abanyala\n\n` +
      `Kila mwanachama anapojisajili ana nafasi ya kuweka ukoo wake ili kusaidia baraza la wazee (*Council of Elders*) katika kuratibu shughuli za kitamaduni, ndoa, usuluhishi na sherehe za Isukuti.\n\n` +
      `Je, unataka kujua zaidi kuhusu historia au viongozi wa ukoo wako?`
    );
  }

  // Chapters & Transfers
  if (
    p.includes("chapter") ||
    p.includes("tawi") ||
    p.includes("matawi") ||
    p.includes("transfer") ||
    p.includes("hamisha") ||
    p.includes("nairobi") ||
    p.includes("nakuru") ||
    p.includes("kisumu") ||
    p.includes("eldoret") ||
    p.includes("mombasa")
  ) {
    return (
      `**Mtandao wa Matawi ya Kitaifa (National Chapters Network)**\n\n` +
      `Mulembe18 inakua kutoka majaribio ya Mombasa kuelekea nchi nzima:\n\n` +
      `• **Tawi la Majaribio (Pilot):** Mombasa County (001) — lina wajumbe zaidi ya 1,420 waliosajiliwa.\n` +
      `• **Matawi ya Upanuzi (Expansion):** Nairobi Metropolitan (047), Nakuru (032), Kisumu (042), na Eldoret (027).\n` +
      `• **Matawi ya Asili (Home Counties):** Kakamega (037), Bungoma (039), Vihiga (038), na Busia (040).\n` +
      `• **Uhamisho wa Mwanachama (FR-05):** Ukihamia kaunti nyingine kwa ajili ya kazi au masomo, unaweza kuomba uhamisho moja kwa moja bila kupoteza historia yako ya michango wala rekodi ya uanachama.\n\n` +
      `Bofya kichupo cha **Chapters** kwenye menyu kuu kutazama wasifu wa mwenyekiti na mawasiliano ya kila tawi.`
    );
  }

  // Housing / Living / Newcomers
  if (
    p.includes("nyumba") ||
    p.includes("house") ||
    p.includes("rent") ||
    p.includes("bamburi") ||
    p.includes("nyali") ||
    p.includes("likoni") ||
    p.includes("matatu") ||
    p.includes("mgeni") ||
    p.includes("newcomer")
  ) {
    return (
      `**Mwongozo wa Mgeni Mpya (Newcomer's Settling Guide)**\n\n` +
      `Ukiwa mgeni uliyewasili Pwani au mjini, Mulembe18 inakuhakikishia hautakuwa mpweke:\n\n` +
      `1. **Maeneo ya Makazi Yanayopendelewa:**\n` +
      `   • **Bamburi & Kiembeni:** Nyumba za bei nafuu (KES 5,000 – 12,000), jumuia kubwa ya jamii yetu, na soko la vyakula vya asili.\n` +
      `   • **Tudor & Majengo:** Karibu na chuo cha TUM na Bandari ya Mombasa (KES 8,000 – 18,000).\n` +
      `   • **Nyali:** Eneo la kibiashara linalofaa wataalamu na wafanyabiashara (KES 20,000+).\n` +
      `2. **Usafiri:** Matatu Nambari 10 (Posta hadi Bamburi/Mtwapa) au Basi za Mwembe Tayari zinazotoka moja kwa moja Magharibi.\n` +
      `3. **Noticeboard:** Tembelea ukurasa wetu wa **Noticeboard** kuona nyumba zilizothibitishwa zilizoorodheshwa na wanachama wetu bila madalali walaghai!`
    );
  }

  // Events / Isukuti / Culture
  if (
    p.includes("event") ||
    p.includes("tukio") ||
    p.includes("matukio") ||
    p.includes("isukuti") ||
    p.includes("ngoma") ||
    p.includes("cultural") ||
    p.includes("tarehe") ||
    p.includes("rsvp")
  ) {
    return (
      `**Matukio na Sherehe za Kitamaduni (Mulembe Calendar)**\n\n` +
      `Sherehe kuu zijazo ni pamoja na:\n\n` +
      `• **Tamasha la Isukuti & Chakula cha Asili:** 14 Nov 2026, Mombasa Sports Club Grounds (Ngoma za jadi, mashindano ya kupiga ngoma, kuku wa kienyeji na simba wa kitamaduni).\n` +
      `• **Baraza la Wazee na Ustawi:** 21 Nov 2026, Ukumbi wa Likoni Community Centre.\n` +
      `• **Kongamano la Vijana na Teknolojia:** 19 Dec 2026, Technical University of Mombasa (TUM).\n\n` +
      `Unaweza kupata pasi ya bure ya **RSVP** moja kwa moja kwenye sehemu ya Events ili kuhifadhi kiti chako na kupokea vikumbusho vya WhatsApp au SMS!`
    );
  }

  // Thanks / Appreciation
  if (p.includes("asante") || p.includes("thank") || p.includes("shukran") || p.includes("orio")) {
    return (
      `**Karibu sana! (Muno muno!)**\n\n` +
      `Ni furaha yangu kukuhudumia. Jukwaa la Mulembe18 liko hapa kuhakikisha jamii yetu inaungana, inasaidiana, na inasonga mbele kwa pamoja.\n\n` +
      `Ikiwa una swali lingine lolote kuhusu ustawi, usajili, koo, au matukio, niko hapa kusaidia wakati wowote!`
    );
  }

  // Leadership / Council of Elders
  if (
    p.includes("leader") ||
    p.includes("kiongozi") ||
    p.includes("viongozi") ||
    p.includes("mwenyekiti") ||
    p.includes("chairman") ||
    p.includes("elder") ||
    p.includes("wazee")
  ) {
    return (
      `**Uongozi wa Mulembe18 na Baraza la Wazee (Leadership & Elders)**\n\n` +
      `Uongozi wetu unazingatia uwazi, heshima, na ushirikishwaji wa koo zote 18:\n\n` +
      `• **Mwenyekiti wa Kitaifa:** Huratibu uhusiano wa kitaifa, serikali za kaunti, na mikakati ya maendeleo.\n` +
      `• **Wenyeviti wa Matawi:** Mombasa Flagship Chapter, Nairobi, Nakuru, Kisumu na Eldoret.\n` +
      `• **Baraza la Wazee (Council of Elders):** Hutoa mwongozo wa kitamaduni, usuluhishi wa amani, na uthibitisho wa asili ya koo.\n` +
      `• **Mfumo wa Dual Sign-Off:** Hakuna fedha za ustawi zinazotolewa bila idhini sambamba ya Mweka Hazina na Mwenyekiti.\n\n` +
      `Unaweza kutazama wasifu kamili wa viongozi kwenye ukurasa wa **Leadership** kwenye menyu kuu.`
    );
  }

  // General cultured, natural response
  return (
    `**Mulembe! Asante kwa kuuliza.** Kama **Msingi AI**, nina furaha kukusaidia kuelewa na kufikia huduma zote za jukwaa la Mulembe18 kwa urahisi.\n\n` +
    `Mambo ya haraka unayoweza kufanya hapa:\n` +
    `• **Koo 18 za Waluhya:** Jua historia, maeneo ya nyumbani, na miiko ya ukoo wako.\n` +
    `• **Mfuko wa Ustawi (Welfare):** Angalia taarifa za Paybill (\`522522\`, Akaunti: \`MULEMBE18\`) na ada ya mwezi ya KES 200.\n` +
    `• **Matawi ya Kaunti:** Angalia ofisi za Mombasa, Nairobi, Kisumu, Nakuru, Eldoret, na Western.\n` +
    `• **Mawasiliano ya Dharura:** Piga simu kwa **0712 345 678** au nambari fupi ya bure ya USSD **\*384\*18#**.\n\n` +
    `Tafadhali niambie kwa undani zaidi kile unachotaka kufahamu, nami nitakupa mwongozo sahihi mara moja!`
  );
}

function generateSuggestedActions(prompt: string): string[] {
  const p = prompt.toLowerCase();
  if (p.includes("welfare") || p.includes("mchango") || p.includes("pesa")) {
    return ["Lipa Ada ya Mwezi (200)", "Orodha ya Malipo ya Umma", "Soma Kanuni za Rambirambi"];
  }
  if (p.includes("clan") || p.includes("koo")) {
    return ["Tazama Koo 18", "Tafuta Mwanachama kwa Ukoo", "Wasiliana na Wazee"];
  }
  if (p.includes("nyumba") || p.includes("mgeni") || p.includes("rent")) {
    return ["Fungua Noticeboard ya Nyumba", "Njia za Matatu Mombasa", "Jisajili kama Mgeni"];
  }
  return ["Koo 18 za Luhya", "Jinsi ya Kulipa Welfare", "Matawi ya Kenya", "Matukio ya Isukuti"];
}

