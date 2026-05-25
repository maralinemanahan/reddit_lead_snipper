const input = $input.first().json;
const rawItems = input?.items || [];
const staticData = $getWorkflowStaticData('global');

const platformKeywords = ['calendly', 'acuity', 'booking', 'stripe', 'invoice', 'crm', 'forms', 'email list', 'newsletter', 'spreadsheet', 'excel'];

const industryKeywords = ['client', 'customer', 'appointment', 'booking', 'service', 'cleaning', 'care', 'plumbing', 'lending'];

const painKeywords = ['workflow', 'save time', 'streamline', 'forgetting', 'notifying', 'reminders', 'few bookings', 'few clients'];

const ownerKeywords = ['my business', 'my shop', 'my clients', 'my site', 'my pinterest', 'my instagram', 'my digital product', 'my restaurant', 'my cleaning business', 'my cleaning services', 'my agency'];

staticData.seenIds = staticData.seenIds || [];
const processedLeads = [];

for (const item of rawItems) {
    const title = (item.title || '').toLowerCase();
    const description = (item.description || item.selftext || '').toLowerCase();
    const content = `${title} ${description}`.toLowerCase();
    const link = item.link || item.url || "";
    const author = item.author || "Anonymous";
    const fingerprint = `${author}|${title}|${link}`;
    const leadId = Number(`${Math.floor(Math.random() * 1000000)}`);

    if (staticData.seenIds.includes(fingerprint)) {
      continue;
    }

    const isGarbage = ['for sale', 'real estate', 'property', 'investment', 'trivia', 'fun fact', 'did you know', 'guide for beginners', 'for hire', 'hiring', 'review',].some(word => content.includes(word));
    if (isGarbage) continue;

    const isPolitics = ['election', 'government', 'senate', 'vote', 'republicant', 'democrat', 'minister', 'war', 'breaking news', 'protest', 'liberal', 'legalize'].some(word => content.includes(word));
    if (isPolitics) continue;

    const isCompetitor = ['automate', 'I build an AI', 'I build AI agents'].some(word => content.includes(word));
    if (isCompetitor) continue;

    const isTrivia = ['Complete Guide', 'Best ways', 'no experience needed', 'side hustle ideas', 'How to make money', 'How to start your'].some(word => content.includes(word));
    if (isTrivia) continue;
  
    const inServiceIndustry = industryKeywords.some(word => content.includes(word));
    const hasPlatform = platformKeywords.some(word => content.includes(word));
    const hasPain = painKeywords.some(word => content.includes(word));
    const hasBusiness = ownerKeywords.some(word => content.includes(word));

    if (inServiceIndustry && (hasPlatform || hasPain || hasBusiness)) {
      staticData.seenIds.push(fingerprint);
      
      processedLeads.push({
        json: {
          title: title,
          category: inServiceIndustry ? 'Service Provider' : 
            'General Business',
          priority: hasPain? 'High (Pain Expressed)' : 'Medium',
          link: item.link || item.url || "",
          author: author,
          id: leadId,
          isLead: true
        }
     });
   }
}
return processedLeads;
