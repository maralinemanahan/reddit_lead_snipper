const input = $input.first().json;
const rawItems = input?.items || [];

const platformKeywords = ['calendly', 'acuity', 'booking', 'stripe', 'invoice', 'crm', 'forms', 'email list', 'newsletter', 'spreadsheet', 'excel'];

const industryKeywords = ['client', 'customer', 'patient', 'appointment', 'booking', 'service', 'cleaning', 'care', 'plumbing', 'design', 'coaching', 'consulting', 'hospitality', 'venue', 'rental', 'lending'];

const painKeywords = ['manual', 'too much time', 'tired of', 'waste', 'efficiency', 'automation', 'automate', 'workflow', 'save time', 'streamline', 'forgetting', 'notifying', 'reminders', 'few bookings', 'few clients'];

const seenFingerprints = new Set();
const processedLeads = [];

for (const item of rawItems) {
    const title = (item.title || '').toLowerCase();
    const description = (item.description || item.selftext || '').toLowerCase();
    const content = title + ' ' + description;
    const link = item.link || item.url || "";
    const author = item.author || "Anonymous";
    const fingerprint = `${author}|${description}`;

    if (seenFingerprints.has(fingerprint)) continue;

    const isCompetition = ['for hire', 'virtual assistant', 'hiring', 'offer', 'service', 'promo', 'available'].some(word => title.includes(word));
    if (isCompetition) continue;
  
    const isOwner = ['my business', 'my shop', 'my clients', 'my site', 'my process', 'running a'].some(word => content.includes(word));
    if (isOwner) continue;
  
    const inServiceIndustry = industryKeywords.some(word => content.includes(word));
    const hasPlatform = platformKeywords.some(word => content.includes(word));
    const hasPain = painKeywords.some(word => content.includes(word));

    if (inServiceIndustry && (hasPlatform || hasPain)) {
      seenFingerprints.add(fingerprint);
      
      processedLeads.push({
        json: {
          title: title,
          category: inServiceIndustry ? 'Service Provider' : 
            'General Business',
          priority: hasPain? 'High (Pain Expressed)' : 'Medium',
          link: item.link || item.url || "",
          author: author,
          isLead: true
        }
     });
   }
}
return processedLeads;
