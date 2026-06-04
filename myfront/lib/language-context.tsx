"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "mr" | "hi"

export const accentColors = [
  { name: "Purple", value: "#6c63ff" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Pink", value: "#ec4899" },
]

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  accentColor: string
  setAccentColor: (color: string) => void
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const translations: Record<Language, Record<string, any>> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.education": "Education",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.contact": "Contact",
    "nav.all_products": "Products",
    "nav.menu": "MENU",
    "nav.buildSomething": "Let's Build Something",
    "hero.hi": "Hi, I'm",
    "hero.available": "Available for opportunities",
    "hero.description": "Passionate developer with expertise in building modern, scalable web applications. Currently pursuing MCA with a focus on creating impactful digital solutions.",
    "hero.getInTouch": "Get In Touch",
    "hero.viewProducts": "View Products",
    "hero.findMe": "Find me:",
    "hero.github": "GitHub",
    "hero.linkedin": "LinkedIn",
    "products.sortBy": "Sort By",
    "products.priceLowHigh": "Price: Low to High",
    "products.priceHighLow": "Price: High to Low",
    "products.newest": "Newest First",
    "products.wishlist": "My Wishlist",
    "products.addToWishlist": "Add to Wishlist",
    "products.removeFromWishlist": "Remove from Wishlist",
    "products.noWishlist": "Your wishlist is empty.",
    "products.compare": "Compare",
    "products.addToCompare": "Add to Compare",
    "products.removeFromCompare": "Remove from Compare",
    "products.compareLimit": "You can compare up to 3 products.",
    "products.share": "Share",
    "products.linkCopied": "Link copied to clipboard!",
    "products.compareList": "Comparison List",
    "products.clearCompare": "Clear Comparison",
    "footer.description": "MCA Student & Full Stack Developer from Tisangi, Maharashtra. Passionate about building elegant digital experiences.",
    "footer.madeWith": "Made with",
    "footer.in": "in Maharashtra",
    "footer.quickLinks": "Quick Links",
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.accent": "Accent Color",
    "settings.dark": "Dark",
    "settings.light": "Light",
    "settings.system": "System",
    "settings.save": "Save Settings",
    "contact.title": "Get in Touch",
    "contact.name": "Your Name",
    "contact.email": "Email Address",
    "contact.email_label": "Email",
    "contact.phone": "Phone",
    "contact.mobile": "Mobile Number",
    "contact.location": "Location",
    "contact.message": "Message",
    "contact.message_optional": "Message (Optional)",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.sent": "Message Sent!",
    "contact.sendMessage": "Send a Message",
    "education.title": "Education",
    "education.subtitle": "Milestones of my academic and technical foundation",
    "skills.title": "Technical Skills",
    "skills.subtitle": "Mastering the modern web stack and development tools",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.database": "Database",
    "skills.tools": "Tools & Others",
    "projects.title": "Featured Projects",
    "projects.subtitle": "High-quality digital solutions for businesses and individuals",
    "projects.viewDetails": "View Details",
    "projects.liveDemo": "Live Demo",
    "projects.sourceCode": "Source Code",
    "projects.technologies": "Technologies",
    "projects.features": "Key Features",
    "edu.seeDetails": "View Details",
    "edu.back": "Back",
    "edu.overview": "Overview",
    "edu.curriculum": "Key Modules & Subjects",
    "edu.academicProjects": "Academic Projects",
    "edu.projectDescription": "Major project completed during the course duration.",
    "edu.earned": "Earned",
    "edu.inFinal": "in final examination.",
    "edu.notFound": "Education details not found.",
    "edu.mca": "MCA",
    "edu.bca": "BCA",
    "edu.12th": "12th Standard",
    "edu.10th": "10th Standard",
    "edu.dyp": "D.Y. Patil College, Talsande",
    "edu.drm": "D.R. Mane College, Kagal",
    "edu.mhs": "M.H. Shine, Tisangi",
    "edu.dmp": "D.M. Patil, Tisangi",
    "hero.typewriter": ["Full Stack Developer", "MCA Student", "React & Next.js Expert", "MERN Stack Developer", "Product Designer"],
    "stats.years": "Years of Study",
    "stats.degrees": "Degrees Earned",
    "stats.projects": "Projects Built",
    "stats.tech": "Technologies",
    "data.education": [
      { id: 1, degree: "Master of Computer Applications (MCA)", institution: "D.Y. Patil College, Talsande", year: "2023 - 2025", status: "Completed", description: "Advanced studies in computer science and modern application development.", details: ["Specialization in Full Stack Development", "Advanced Database Management Systems", "Cloud Computing Basics", "Software Engineering excellence"], grade: "Distinction" },
      { id: 2, degree: "Bachelor of Computer Applications (BCA)", institution: "D.R. Mane College, Kagal", year: "2020 - 2023", status: "Completed", description: "Foundation in programming, database management, and software development.", details: ["Object-Oriented Programming (Java & C++)", "Web Technologies", "Data Structures", "Networking concepts"], grade: "First Class with Distinction" },
      { id: 3, degree: "12th Standard (HSC)", institution: "M.H. Shine, Tisangi", year: "2019 - 2020", status: "Completed", description: "Higher Secondary Certificate from Maharashtra State Board.", details: ["Stream: Science", "Focus on Information Technology & Mathematics"] },
      { id: 4, degree: "11th Standard", institution: "M.H. Shine, Tisangi", year: "2018 - 2019", status: "Completed", description: "Junior College from Maharashtra State Board.", details: ["Academic excellence in Science subjects"] },
      { id: 5, degree: "10th Standard (SSC)", institution: "D.M. Patil, Tisangi", year: "2017 - 2018", status: "Completed", description: "Secondary School Certificate from Maharashtra State Board.", details: ["General subjects with strong performance in Technical studies"] }
    ],
    "data.products": [
      { id: 1, title: "E-Commerce Revolution", description: "A full-scale online shopping experience with real-time inventory and secure payments.", fullDescription: "E-Commerce Revolution is a state-of-the-art platform designed for modern retailers. It features a blazing-fast frontend built with Next.js, a robust backend powered by Supabase, and a serverless architecture for ultimate scalability.", tech: ["Next.js", "TypeScript", "Tailwind", "Supabase"], features: ["Real-time Inventory", "Secure Payment Gateway", "AI Recommendations", "Admin Dashboard"], category: "Web Application" },
      { id: 2, title: "Smart Dairy Analytics", description: "IoT integrated dashboard for monitoring milk quality and collection efficiency.", fullDescription: "Smart Dairy Analytics bridges the gap between traditional farming and modern technology. Using IoT sensors at collection points, it automatically records quality metrics, volume, and temperature.", tech: ["React", "Express", "MongoDB", "Chart.js"], features: ["IoT Integration", "Quality Monitoring", "Farmer Database", "Analytical Reporting"], category: "Enterprise Solution" },
      { id: 3, title: "Jewellery Management Pro", description: "Inventory and billing system for high-end retail jewellery outlets.", fullDescription: "Jewellery Management Pro is a specialized ERP solution for high-value retail. It handles intricate inventory management including gold weight, stone values, and making charges.", tech: ["Electron", "Node.js", "SQLite"], features: ["Gold Weight Tracking", "Professional Billing", "Hallmark Management", "Local-first Security"], category: "Desktop Application" }
    ]
  },
  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.about": "माझ्याबद्दल",
    "nav.education": "शिक्षण",
    "nav.projects": "प्रकल्प",
    "nav.skills": "कौशल्ये",
    "nav.contact": "संपर्क",
    "nav.all_products": "उत्पादने",
    "nav.menu": "मेनू",
    "nav.buildSomething": "चला काहीतरी नवीन बनवूया",
    "hero.hi": "नमस्कार, मी आहे",
    "hero.available": "संधींसाठी उपलब्ध",
    "hero.description": "आधुनिक आणि स्केलेबल वेब ॲप्लिकेशन्स तयार करण्यात निपुण असलेला उत्साही डेव्हलपर. सध्या एमसीए करत असून प्रभावी डिजिटल सोल्यूशन्स तयार करण्यावर लक्ष केंद्रित करत आहे.",
    "hero.getInTouch": "संपर्क साधा",
    "hero.viewProducts": "प्रकल्प पहा",
    "hero.findMe": "येथे शोधा:",
    "hero.github": "गिटहब",
    "hero.linkedin": "लिंक्डइन",
    "products.sortBy": "क्रमवारी लावा",
    "products.priceLowHigh": "किंमत: कमी ते जास्त",
    "products.priceHighLow": "किंमत: जास्त ते कमी",
    "products.newest": "नवीनतम",
    "products.wishlist": "माझी आवडती यादी",
    "products.addToWishlist": "आवडत्या यादीत जोडा",
    "products.removeFromWishlist": "आवडत्या यादीतून काढा",
    "products.noWishlist": "तुमची आवडती यादी रिकामी आहे.",
    "products.compare": "तुलना करा",
    "products.addToCompare": "तुलनेसाठी जोडा",
    "products.removeFromCompare": "तुलनेतून काढा",
    "products.compareLimit": "तुम्ही ३ प्रोजेक्ट्सची तुलना करू शकता.",
    "products.share": "शेअर करा",
    "products.linkCopied": "लिंक कॉपी केली!",
    "products.compareList": "तुलना यादी",
    "products.clearCompare": "तुलना साफ करा",
    "footer.description": "तिसंगी, महाराष्ट्र येथील MCA विद्यार्थी आणि फुल स्टॅक डेव्हलपर. मोहक डिजिटल अनुभव तयार करण्याची आवड.",
    "footer.madeWith": "प्रेमाने बनवलेले",
    "footer.in": "महाराष्ट्रात",
    "footer.quickLinks": "क्विक लिंक्स",
    "hero.typewriter": ["फुल स्टॅक डेव्हलपर", "MCA विद्यार्थी", "रिॲक्ट आणि नेक्स्ट जेएस तज्ञ", "MERN स्टॅक डेव्हलपर", "प्रॉडक्ट डिझायनर"],
    "settings.title": "सेटिंग्ज",
    "settings.language": "भाषा",
    "settings.theme": "थीम",
    "settings.accent": "मुख्य रंग",
    "settings.dark": "गडद",
    "settings.light": "प्रकाश",
    "settings.system": "सिस्टम",
    "settings.save": "सेटिंग्ज जतन करा",
    "contact.title": "संपर्क साधा",
    "contact.name": "तुमचे नाव",
    "contact.email": "ईमेल पत्ता",
    "contact.email_label": "ईमेल",
    "contact.phone": "फोन",
    "contact.mobile": "मोबाईल नंबर",
    "contact.location": "पत्ता",
    "contact.message": "संदेश",
    "contact.message_optional": "संदेश (पर्यायी)",
    "contact.send": "संदेश पाठवा",
    "contact.sending": "पाठवत आहे...",
    "contact.sent": "संदेश पाठवला!",
    "contact.sendMessage": "संदेश पाठवा",
    "education.title": "शिक्षण",
    "education.subtitle": "माझ्या शैक्षणिक आणि तांत्रिक पायाचे टप्पे",
    "skills.title": "तांत्रिक कौशल्ये",
    "skills.subtitle": "आधुनिक वेब स्टॅक आणि डेव्हलपमेंट टूल्समध्ये प्रभुत्व",
    "skills.frontend": "फ्रंटएंड",
    "skills.backend": "बॅकएंड",
    "skills.database": "डेटाबेस",
    "skills.tools": "टूल्स आणि इतर",
    "projects.title": "वैशिष्ट्यपूर्ण प्रकल्प",
    "projects.subtitle": "व्यवसाय आणि व्यक्तींसाठी उच्च-गुणवत्तेची डिजिटल सोल्यूशन्स",
    "projects.viewDetails": "तपशील पहा",
    "projects.liveDemo": "थेट डेमो",
    "projects.sourceCode": "सोर्स कोड",
    "projects.technologies": "तंत्रज्ञान",
    "projects.features": "मुख्य वैशिष्ट्ये",
    "edu.seeDetails": "तपशील पहा",
    "edu.back": "मागे",
    "edu.overview": "आढावा",
    "edu.curriculum": "मुख्य मॉड्यूल आणि विषय",
    "edu.academicProjects": "शैक्षणिक प्रकल्प",
    "edu.projectDescription": "अभ्यासक्रमाच्या कालावधीत पूर्ण केलेला मोठा प्रकल्प.",
    "edu.earned": "मिळाले",
    "edu.inFinal": "अंतिम परीक्षेत.",
    "edu.notFound": "शिक्षणाचे तपशील सापडले नाहीत.",
    "edu.mca": "एम.सी.ए.",
    "edu.bca": "बी.सी.ए.",
    "edu.12th": "१२ वी",
    "edu.10th": "१० वी",
    "edu.dyp": "डी.वाय. पाटील कॉलेज, तळसंदे",
    "edu.drm": "डी.आर. माने कॉलेज, कागल",
    "edu.mhs": "एम.एच. शाईन, तिसंगी",
    "edu.dmp": "डी.एम. पाटील, तिसंगी",
    "stats.years": "अभ्यासाची वर्षे",
    "stats.degrees": "मिळवलेल्या पदव्या",
    "stats.projects": "तयार केलेले प्रकल्प",
    "stats.tech": "तंत्रज्ञान",
    "data.education": [
      { id: 1, degree: "मास्टर ऑफ कॉम्प्युटर ॲप्लिकेशन्स (MCA)", institution: "डी.वाय. पाटील कॉलेज, तळसंदे", year: "2023 - 2025", status: "पूर्ण", description: "कॉम्प्युटर सायन्स आणि आधुनिक ॲप्लिकेशन डेव्हलपमेंटमधील प्रगत अभ्यास.", details: ["फुल स्टॅक डेव्हलपमेंटमध्ये विशेषीकरण", "प्रगत डेटाबेस मॅनेजमेंट सिस्टम", "क्लाउड कॉम्प्युटिंग बेसिक्स", "सॉफ्टवेअर इंजिनिअरिंग उत्कृष्टता"], grade: "डिस्टिंक्शन" },
      { id: 2, degree: "बॅचलर ऑफ कॉम्प्युटर ॲप्लिकेशन्स (BCA)", institution: "डी.आर. माने कॉलेज, कागल", year: "2020 - 2023", status: "पूर्ण", description: "प्रोग्रामिंग, डेटाबेस मॅनेजमेंट आणि सॉफ्टवेअर डेव्हलपमेंटमधील पाया.", details: ["ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (Java आणि C++)", "वेब तंत्रज्ञान", "डेटा स्ट्रक्चर्स", "नेटवर्किंग संकल्पना"], grade: "डिस्टिंक्शनसह प्रथम श्रेणी" },
      { id: 3, degree: "12 वी (HSC)", institution: "एम.एच. शाईन, तिसंगी", year: "2019 - 2020", status: "पूर्ण", description: "महाराष्ट्र राज्य मंडळाकडून उच्च माध्यमिक प्रमाणपत्र.", details: ["शाखा: विज्ञान", "माहिती तंत्रज्ञान आणि गणितावर लक्ष केंद्रित"] },
      { id: 4, degree: "11 वी", institution: "एम.एच. शाईन, तिसंगी", year: "2018 - 2019", status: "पूर्ण", description: "महाराष्ट्र राज्य मंडळाचे कनिष्ठ महाविद्यालय.", details: ["विज्ञान विषयांमध्ये शैक्षणिक उत्कृष्टता"] },
      { id: 5, degree: "10 वी (SSC)", institution: "डी.एम. पाटील, तिसंगी", year: "2017 - 2018", status: "पूर्ण", description: "महाराष्ट्र राज्य मंडळाचे माध्यमिक शालांत प्रमाणपत्र.", details: ["तांत्रिक अभ्यासात चांगली कामगिरी असलेले सामान्य विषय"] }
    ],
    "data.products": [
      { id: 1, title: "ई-कॉमर्स रिव्होल्यूशन", description: "रिअल-टाइम इन्व्हेंटरी आणि सुरक्षित पेमेंटसह पूर्ण-स्तरीय ऑनलाइन खरेदी अनुभव.", fullDescription: "ई-कॉमर्स रिव्होल्यूशन हे आधुनिक किरकोळ विक्रेत्यांसाठी डिझाइन केलेले अत्याधुनिक प्लॅटफॉर्म आहे. यात Next.js सह तयार केलेले जलद फ्रंटएंड आणि Supabase द्वारे समर्थित मजबूत बॅकएंड आहे.", tech: ["Next.js", "TypeScript", "Tailwind", "Supabase"], features: ["रिअल-टाइम इन्व्हेंटरी", "सुरक्षित पेमेंट गेटवे", "AI शिफारसी", "ॲडमिन डॅशबोर्ड"], category: "वेब ॲप्लिकेशन" },
      { id: 2, title: "स्मार्ट डेअरी ॲनालिटिक्स", description: "दुधाची गुणवत्ता आणि संकलन कार्यक्षमतेवर लक्ष ठेवण्यासाठी IoT एकात्मिक डॅशबोर्ड.", fullDescription: "स्मार्ट डेअरी ॲनालिटिक्स पारंपारिक शेती आणि आधुनिक तंत्रज्ञान यांच्यातील अंतर कमी करते. संकलन केंद्रांवर IoT सेन्सर्स वापरून, ते गुणवत्ता, प्रमाण आणि तापमान आपोआप रेकॉर्ड करते.", tech: ["React", "Express", "MongoDB", "Chart.js"], features: ["IoT एकत्रीकरण", "गुणवत्ता देखरेख", "शेतकरी डेटाबेस", "विश्लेषणात्मक अहवाल"], category: "एंटरप्राइझ सोल्यूशन" },
      { id: 3, title: "ज्वेलरी मॅनेजमेंट प्रो", description: "inventory आणि बिलिंग सिस्टम for high-end retail jewellery outlets.", fullDescription: "ज्वेलरी मॅनेजमेंट प्रो हे उच्च-मूल्य रिटेलसाठी एक विशेष ERP सोल्यूशन आहे. हे सोन्याचे वजन, दगडांचे मूल्य आणि मेकिंग चार्जेससह गुंतागुंतीचे इन्व्हेंटरी मॅनेजमेंट हाताळते.", tech: ["Electron", "Node.js", "SQLite"], features: ["सोन्याचे वजन ट्रॅकिंग", "प्रोफेशनल बिलिंग", "हॉलमार्क मॅनेजमेंट", "लोकल-फर्स्ट सुरक्षा"], category: "डेस्कटॉप ॲप्लिकेशन" }
    ]
  },
  hi: {
    "nav.home": "होम",
    "nav.about": "मेरे बारे में",
    "nav.education": "शिक्षा",
    "nav.projects": "प्रोजेक्ट्स",
    "nav.skills": "कौशल",
    "nav.contact": "संपर्क",
    "nav.all_products": "उत्पाद",
    "nav.menu": "मेनू",
    "nav.buildSomething": "चलिए कुछ नया बनाते हैं",
    "hero.hi": "नमस्ते, मैं हूँ",
    "hero.available": "अवसरों के लिए उपलब्ध",
    "hero.description": "आधुनिक और स्केलेबल वेब एप्लिकेशन बनाने में कुशल उत्साही डेवलपर। वर्तमान में एमसीए कर रहा हूँ और प्रभावशाली डिजिटल समाधान बनाने पर ध्यान केंद्रित कर रहा हूँ।",
    "hero.getInTouch": "संपर्क करें",
    "hero.viewProducts": "प्रोजेक्ट्स देखें",
    "hero.findMe": "यहाँ खोजें:",
    "hero.github": "गिटहब",
    "hero.linkedin": "लिंक्डइन",
    "products.sortBy": "क्रमबद्ध करें",
    "products.priceLowHigh": "कीमत: कम से अधिक",
    "products.priceHighLow": "कीमत: अधिक से कम",
    "products.newest": "नवीनतम",
    "products.wishlist": "मेरी विशलिस्ट",
    "products.addToWishlist": "विशलिस्ट में जोड़ें",
    "products.removeFromWishlist": "विशलिस्ट से हटाएं",
    "products.noWishlist": "आपकी विशलिस्ट खाली है।",
    "products.compare": "तुलना करें",
    "products.addToCompare": "तुलना के लिए जोड़ें",
    "products.removeFromCompare": "तुलना से हटाएं",
    "products.compareLimit": "आप अधिकतम 3 प्रोजेक्ट्स की तुलना कर सकते हैं।",
    "products.share": "शेअर करें",
    "products.linkCopied": "लिंक कॉपी हो गई!",
    "products.compareList": "तुलना सूची",
    "products.clearCompare": "तुलना साफ करें",
    "footer.description": "तिसंगी, महाराष्ट्र से MCA छात्र और फुल स्टॅक डेवलपर। सुंदर डिजिटल अनुभव बनाने का जुनून।",
    "footer.madeWith": "प्यार से बनाया गया",
    "footer.in": "महाराष्ट्र में",
    "footer.quickLinks": "क्विक लिंक्स",
    "hero.typewriter": ["फुल स्टैक डेवलपर", "MCA छात्र", "रिएक्ट और नेक्स्ट जेएस विशेषज्ञ", "MERN स्टैक डेवलपर", "प्रोडक्ट डिजाइनर"],
    "settings.title": "सेटिंग्स",
    "settings.language": "भाषा",
    "settings.theme": "थीम",
    "settings.accent": "मुख्य रंग",
    "settings.dark": "डार्क",
    "settings.light": "लाइट",
    "settings.system": "सिस्टम",
    "settings.save": "सेटिंग्स सहेजें",
    "contact.title": "संपर्क करें",
    "contact.name": "आपका नाम",
    "contact.email": "ईमेल पता",
    "contact.email_label": "ईमेल",
    "contact.phone": "फोन",
    "contact.mobile": "मोबाइल नंबर",
    "contact.location": "स्थान",
    "contact.message": "संदेश",
    "contact.message_optional": "संदेश (वैकल्पिक)",
    "contact.send": "संदेश भेजें",
    "contact.sending": "भेज रहे हैं...",
    "contact.sent": "संदेश भेज दिया गया!",
    "contact.sendMessage": "संदेश भेजें",
    "education.title": "शिक्षा",
    "education.subtitle": "मेरी शैक्षणिक और तकनीकी नींव के मील के पत्थर",
    "skills.title": "तकनीकी कौशल",
    "skills.subtitle": "आधुनिक वेब स्टैक और डेवलपमेंट टूल्स में महारत",
    "skills.frontend": "फ्रंटएंड",
    "skills.backend": "बैकएंड",
    "skills.database": "डेटाबेस",
    "skills.tools": "टूल्स और अन्य",
    "projects.title": "विशेष प्रोजेक्ट्स",
    "projects.subtitle": "व्यवसायों और व्यक्तियों के लिए उच्च गुणवत्ता वाले डिजिटल समाधान",
    "projects.viewDetails": "विवरण देखें",
    "projects.liveDemo": "लाइव डेमो",
    "projects.sourceCode": "सोर्स कोड",
    "projects.technologies": "तकनीक",
    "projects.features": "मुख्य विशेषताएं",
    "edu.seeDetails": "विवरण देखें",
    "edu.back": "पीछे",
    "edu.overview": "अवलोकन",
    "edu.curriculum": "मुख्य मॉड्यूल और विषय",
    "edu.academicProjects": "शैक्षिक प्रोजेक्ट्स",
    "edu.projectDescription": "पाठ्यक्रम की अवधि के दौरान पूरा किया गया प्रमुख प्रोजेक्ट।",
    "edu.earned": "प्राप्त किया",
    "edu.inFinal": "अंतिम परीक्षा में।",
    "edu.notFound": "शिक्षा विवरण नहीं मिले।",
    "edu.mca": "एम.सी.ए.",
    "edu.bca": "बी.सी.ए.",
    "edu.12th": "१२ वीं",
    "edu.10th": "१० वीं",
    "edu.dyp": "डी.वाई. पाटिल कॉलेज, तलसंडे",
    "edu.drm": "डी.आर. माने कॉलेज, कागल",
    "edu.mhs": "एम.एच. शाइन, तिसंगी",
    "edu.dmp": "डी.एम. पाटिल, तिसंगी",
    "stats.years": "अध्ययन के वर्ष",
    "stats.degrees": "डिग्रियां प्राप्त कीं",
    "stats.projects": "बनाए गए प्रोजेक्ट्स",
    "stats.tech": "तकनीक",
    "data.education": [
      { id: 1, degree: "मास्टर ऑफ कंप्यूटर एप्लिकेशन (MCA)", institution: "डी.वाई. पाटिल कॉलेज, तलसंडे", year: "2023 - 2025", status: "पूर्ण", description: "कंप्यूटर विज्ञान और आधुनिक एप्लिकेशन विकास में उन्नत अध्ययन।", details: ["फुल स्टैक डेवलपमेंट में विशेषज्ञता", "उन्नत डेटाबेस प्रबंधन प्रणाली", "क्लाउड कंप्यूटिंग बेसिक्स", "सॉफ्टवेयर इंजीनियरिंग उत्कृष्टता"], grade: "डिस्टिंक्शन" },
      { id: 2, degree: "बैचलर ऑफ कंप्यूटर एप्लिकेशन (BCA)", institution: "डी.आर. माने कॉलेज, कागल", year: "2020 - 2023", status: "पूर्ण", description: "प्रोग्रामिंग, डेटाबेस प्रबंधन और सॉफ्टवेयर विकास में आधार।", details: ["ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (Java और C++)", "वेब तकनीक", "डेटा स्ट्रक्चर्स", "नेटवर्किंग अवधारणाएं"], grade: "डिस्टिंक्शन के साथ प्रथम श्रेणी" },
      { id: 3, degree: "12वीं (HSC)", institution: "एम.एच. शाइन, तिसंगी", year: "2019 - 2020", status: "पूर्ण", description: "महाराष्ट्र राज्य बोर्ड से उच्च माध्यमिक प्रमाण पत्र।", details: ["शाखा: विज्ञान", "सूचना प्रौद्योगिकी और गणित पर ध्यान"] },
      { id: 4, degree: "11वीं", institution: "एम.एच. शाइन, तिसंगी", year: "2018 - 2019", status: "पूर्ण", description: "महाराष्ट्र राज्य बोर्ड का जूनियर कॉलेज।", details: ["विज्ञान विषयों में शैक्षणिक उत्कृष्टता"] },
      { id: 5, degree: "10वीं (SSC)", institution: "डी.एम. पाटिल, तिसंगी", year: "2017 - 2018", status: "पूर्ण", description: "महाराष्ट्र राज्य बोर्ड से माध्यमिक विद्यालय प्रमाणपत्र।", details: ["तकनीकी अध्ययन में अच्छे प्रदर्शन के साथ सामान्य विषय"] }
    ],
    "data.products": [
      { id: 1, title: "ई-कॉमर्स रिवोल्यूशन", description: "रियल-टाइम इन्वेंट्री और सुरक्षित भुगतान के साथ पूर्ण-स्तरीय ऑनलाइन शॉपिंग अनुभव।", fullDescription: "ई-कॉमर्स रिवोल्यूशन आधुनिक खुदरा विक्रेताओं के लिए डिज़ाइन किया गया एक अत्याधुनिक प्लेटफॉर्म है। इसमें Next.js के साथ बनाया गया तेज़ फ्रंटएंड और Supabase द्वारा संचालित मजबूत बैकएंड है।", tech: ["Next.js", "TypeScript", "Tailwind", "Supabase"], features: ["रियल-टाइम इन्वेंट्री", "सुरक्षित पेमेंट गेटवे", "AI सिफारिशें", "एडमिन डैशबोर्ड"], category: "वेब एप्लिकेशन" },
      { id: 2, title: "स्मार्ट डेयरी एनालिटिक्स", description: "दूध की गुणवत्ता और संग्रह दक्षता की निगरानी के लिए IoT एकीकृत डैशबोर्ड।", fullDescription: "स्मार्ट डेयरी एनालिटिक्स पारंपरिक खेती और आधुनिक तकनीक के बीच की खाई को पाटता है। संग्रह केंद्रों पर IoT सेंसर का उपयोग करके, यह गुणवत्ता, मात्रा और तापमान को स्वचालित रूप से रिकॉर्ड करता है।", tech: ["React", "Express", "MongoDB", "Chart.js"], features: ["IoT एकीकरण", "गुणवत्ता निगरानी", "किसान डेटाबेस", "विश्लेषणात्मक रिपोर्टिंग"], category: "एंटरप्राइज सॉल्यूशन" },
      { id: 3, title: "ज्वेलरी मैनेजमेंट प्रो", description: "Inventory और बिलिंग सिस्टम for high-end retail jewellery outlets.", fullDescription: "ज्वेलरी मैनेजमेंट प्रो उच्च-मूल्य वाले रिटेल के लिए एक विशेष ईआरपी समाधान है। यह सोने के वजन, पत्थर के मूल्य और मेकिंग शुल्क के साथ जटिल इन्वेंट्री प्रबंधन को संभालता है।", tech: ["Electron", "Node.js", "SQLite"], features: ["गोल्ड वेट ट्रैकिंग", "प्रोफेशनल बिलिंग", "हॉलमार्क मैनेजमेंट", "लोकल-फर्स्ट सुरक्षा"], category: "डेस्कटॉप एप्लिकेशन" }
    ]
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en")
  const [accentColor, setAccentColorState] = useState("#6c63ff")

  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") as Language
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang)
    }

    const savedAccent = localStorage.getItem("app-accent")
    if (savedAccent) {
      setAccentColorState(savedAccent)
      document.documentElement.style.setProperty("--primary", savedAccent)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("app-language", lang)
  }

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    localStorage.setItem("app-accent", color)
    document.documentElement.style.setProperty("--primary", color)
  }

  const t = (key: string): any => {
    return translations[language][key] || translations["en"][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, accentColor, setAccentColor, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
