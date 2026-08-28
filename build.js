#!/usr/bin/env node

/**
 * Let's Be Ready — Static Site Build Script
 *
 * Fetches structured content from Sanity CMS, processes Mustache-style
 * HTML templates, and writes the rendered site to dist/. Also copies
 * static assets, generates the expense pie chart SVG, and emits a flat
 * classrooms.json for the Leaflet map on the homepage.
 *
 * If SANITY_PROJECT_ID is unset, the script falls back to a static
 * getFallbackData() blob so local dev works without any credentials.
 *
 * Run:
 *   SANITY_PROJECT_ID=xxx SANITY_DATASET=production node build.js
 *
 * Or, with no env vars, just `node build.js` for fallback content.
 */

const fs = require('fs');
const path = require('path');

// --- Config ---
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN; // optional — only needed for private datasets
const SANITY_API_VERSION = '2024-01-01';

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const DIST_DIR = path.join(__dirname, 'dist');
const STATIC_FILES = ['styles.css', 'redesign.css', 'main.js', 'map.js', 'training.html'];
const STATIC_DIRS = ['assets', '.well-known'];

/**
 * Static fallback data, used when SANITY_PROJECT_ID is not set (i.e. local
 * dev without credentials). Mirrors the shape of what fetchSanityData()
 * returns so the rest of the build pipeline doesn't care which source it
 * came from.
 *
 * Editing this is a quick way to test template changes without spinning
 * up the Studio. In production this is never used; the live site always
 * fetches from Sanity.
 *
 * @returns {{content: object, team_members: object[], staff_members: object[], partners: object[], expense_allocation: object[], classrooms: object|null}}
 */
function getFallbackData() {
  return {
    content: {
      // Site-wide
      site_name: "Let's Be Ready",
      logo_url: 'https://static.wixstatic.com/media/b86cca_fad6ad16645e42dca07079533d335af6~mv2.png/v1/fill/w_80,h_80,al_c,q_85/cropped-cropped-logo-1-e1497444809475.png',
      favicon_url: 'assets/favicon.png',
      footer_description: 'Empowerment and transformation through education. A 501(c)(3) nonprofit transforming preschool education in rural Guatemala since 2008.',
      org_address: '1014 Pauline Avenue<br>Bellaire, Texas 77401',
      copyright_year: new Date().getFullYear().toString(),

      // Contact / social (editable in Sanity Site Settings)
      contact_email: 'contact@letsbeready.org',
      social_facebook: 'https://www.facebook.com/LetsbereadyGT',
      social_instagram: 'https://www.instagram.com/letsbereadygt/',
      social_youtube: 'https://www.youtube.com/@letsbeready2024',
      globalgiving_url: 'https://www.globalgiving.org/donate/9002/lets-be-ready/',
      og_image_url: '',

      // Footer trust pills
      trust_pill_1: 'Verified 501(c)(3)',
      trust_pill_2: '100% to Programs',
      trust_pill_3: 'Since 2008',

      // Hero
      hero_headline: 'Transforming Preschool<br>\n        Education in Guatemala',
      hero_sub: 'In rural Guatemala, preschools are rare.<br>\n        We\'re changing that &mdash; one village at a time.',
      hero_cta_text: 'Donate Now',
      hero_image_url: 'https://static.wixstatic.com/media/b86cca_0e2ea1940ac44331a21dd51fd50d9a5a~mv2.jpg/v1/fill/w_1920,h_1280,al_c,q_85/Teacher%20and%20students.JPG',
      hero_image_alt: 'A teacher with young students in a rural Guatemalan classroom',

      // Disparity
      disparity_eyebrow: 'The Reality',
      disparity_headline: 'In Guatemala, a child born in a rural Mayan village has a <em>1 in 5</em> chance of finishing primary school.',
      disparity_stat1_value: '80%',
      disparity_stat1_text: 'of rural children drop out before finishing primary school',
      disparity_stat2_value: 'Zero',
      disparity_stat2_text: 'preschool options in most rural villages',
      disparity_stat3_value: 'Invisible',
      disparity_stat3_text: 'Communities so remote they\'re invisible to the education system',

      // Turn
      turn_word: 'But.',
      turn_question: 'What if the solution was already<br>\n          inside the community?',

      // Model steps
      model_step1_image_url: 'https://static.wixstatic.com/media/b86cca_527419ab121c4c938652b89e1b7eedea~mv2.jpg/v1/fill/w_800,h_600,al_c,q_80/IMG_20240801_155859.jpg',
      model_step1_image_alt: 'A young facilitator being trained to teach preschool',
      model_step1_title: 'A young woman from the village steps forward.',
      model_step1_text: 'She cares deeply about her community. We train her with a culturally adapted curriculum &mdash; three manuals built specifically for Mayan communities.',
      model_step2_image_url: 'https://static.wixstatic.com/media/b86cca_e222394152f44f719607544671f2bca9~mv2.jpg/v1/fill/w_800,h_600,al_c,q_80/Our-approach-in-guatermala-2024.jpg',
      model_step2_image_alt: 'Children learning in a community classroom in rural Guatemala',
      model_step2_title: 'She opens a classroom in her home.',
      model_step2_text: '12 to 15 children, ages 4 to 6, learn in small groups for 2&ndash;3 hours a day. No building needed. No bureaucracy. Just a room, a teacher, and a curriculum that works.',
      model_step3_image_url: 'https://static.wixstatic.com/media/b86cca_62cd990a9ac24c0e9f57b707a375c718~mv2.jpg/v1/fill/w_800,h_600,al_c,q_80/20240313_142741-1-2-scaled.jpg',
      model_step3_image_alt: 'Happy children in a Let\'s Be Ready preschool classroom',
      model_step3_title: 'Children discover what\'s possible.',
      model_step3_text: 'Education. Daily nutrition. Gardening. Art. Social-emotional skills. Two years in our program, and these children are ready for first grade &mdash; and for a different kind of life.',

      // Proof stats
      proof_eyebrow: 'Proof, Not Promises',
      proof_heading: 'This works. Here are the numbers.',
      stat_pass_rate: '95',
      stat_pass_rate_label: 'pass first grade',
      stat_pass_rate_context: 'The national rural average is under 20%. Our kids pass at <strong>95%</strong>.',
      stat_children: '600',
      stat_children_label: 'children learning right now',
      stat_children_context: 'Across 45 classrooms in 5 departments of Guatemala, as of 2025.',
      stat_graduation_value: '8 out of 10',
      stat_graduation_label: 'finish primary school',
      stat_graduation_context: 'Most rural children drop out in year one. Our graduates keep going.',
      stat_years_value: '17 yrs',
      stat_years_label: 'proven track record',
      stat_years_context: 'Founded in 2008. Not a pilot. Not an experiment. A proven, replicable model.',

      // Map
      map_eyebrow: 'See the Impact',
      map_heading: '45 classrooms.<br>5 departments.<br>One map.',
      map_description: 'Every pin is a real classroom, run by a real teacher, in a real community. Click to meet them.',

      // Cost
      cost_eyebrow: 'The Cost of Change',
      cost_per_child: '$300',
      cost_per_classroom: '$3,800',
      cost_classroom_desc: 'An entire classroom of 12&ndash;15 children for a full year.',
      cost_context: 'That\'s less than a dollar a day. The model is so efficient because teachers are from the community, classrooms are in homes, and the curriculum was built specifically for this context.',
      cost_cta_text: 'Learn How to Help',

      // Allocation (Where Your Money Goes)
      allocation_heading: 'Where Your Money Goes',
      allocation_subheading: '100% goes to programs',
      allocation_item1_title: 'Teacher Stipends',
      allocation_item1_desc: 'Monthly pay for 45 community facilitators, deposited directly into their personal bank accounts.',
      allocation_item2_title: 'Curriculum &amp; Materials',
      allocation_item2_desc: 'Three custom teaching manuals, educational supplies, and training sessions three times per year.',
      allocation_item3_title: 'Child Nutrition',
      allocation_item3_desc: 'Daily nutritional snacks for every student. You can\'t learn when you\'re hungry.',
      allocation_item4_title: 'Extension Programs',
      allocation_item4_desc: 'Gardening, art, environmental awareness, and social-emotional learning that builds the whole child.',

      // Transparency
      transparency_image_url: 'assets/transparency.jpg',
      transparency_image_alt: 'Teacher training session with Let\'s Be Ready facilitators',
      transparency_eyebrow: 'Full Transparency',
      transparency_heading: 'We believe you deserve to<br>know everything',
      transparency_text: 'Our 501(c)(3) corporate account at Charles Schwab is managed by a certified accountant. Funds transfer monthly to Guatemala, requiring dual signatures. Directors and our Guatemalan accountant review every expense monthly. Teachers receive stipends directly in their bank accounts.',
      finance_year: '2025',
      finance_total_donated: '$279,000',
      finance_total_spent: '$249,000',
      finance_note: 'Substantial additional in-kind packed nutrition is supplied annually by a generous donor.',

      // Team
      team_eyebrow: 'The People Behind This',
      team_heading: 'Run by Guatemalan women. Supported by people like <em>you</em>.',
      team_footer_text: 'Our board includes educators, nonprofit leaders, and professionals who volunteer their time. Every dollar raised goes to Guatemala.',

      // Quote
      founder_quote: '&ldquo;Dedicated men and women believe that <em>all</em> children in their communities deserve access to early education. They opened preschools in their homes, and they changed everything.&rdquo;',
      founder_quote_cite: '&mdash; Let\'s Be Ready, 2026',

      // Final CTA
      final_cta_heading: 'Thousands of children<br>\n          are still waiting.',
      final_cta_text: 'We have 45 classrooms. Thousands more are needed. The model works. The teachers are ready. The only thing missing is funding.',
      final_cta_button: 'Donate Now',

      // Donate page
      donate_headline: 'She\'s never held<br>a <em>pencil.</em>',
      donate_sub: 'In rural Guatemala, 4 out of 5 children never attend preschool. Not because they can\'t learn &mdash; because there isn\'t one. <strong>Your donation changes that.</strong>',
      donate_image_url: 'https://static.wixstatic.com/media/b86cca_b489ead10c7b4188988ce83da95fd643~mv2.jpg/v1/fill/w_600,h_450,al_c,q_80/WhatsApp-Image-2024-05-09-at-11.59.33-AM.jpg',
      donate_image_alt: 'Children in a classroom in rural Guatemala',
      donate_quote: '&ldquo;Before Aula Magica, my daughter had never held a crayon. Now she reads to her little brother every night.&rdquo;',
      donate_quote_cite: '&mdash; Mother in Patzit&eacute;, Guatemala',
      donate_stat1_value: '600+',
      donate_stat1_label: 'Children educated',
      donate_stat2_value: '95%',
      donate_stat2_label: 'Pass first grade',
      donate_stat3_value: '100%',
      donate_stat3_label: 'Funds programs',
      // GiveLively widget — paste full <script>+<div> embed snippet from
      // GiveLively dashboard → Donation Widgets → Get Embed Code
      givelively_widget: '<!-- Begin Give Lively Fundraising Widget -->\n<script>gl=document.createElement(\'script\');gl.src=\'https://secure.givelively.org/widgets/simple_donation/lets-be-ready.js?show_suggested_amount_buttons=true&show_in_honor_of=false&address_required=false&has_required_custom_question=null&suggested_donation_amounts[]=25&suggested_donation_amounts[]=50&suggested_donation_amounts[]=100&suggested_donation_amounts[]=250\';document.getElementsByTagName(\'head\')[0].appendChild(gl);</script><div id="give-lively-widget" class="gl-simple-donation-widget"></div>\n<!-- End Give Lively Fundraising Widget -->',
      sponsor_badge: 'Yearly',
      sponsor_heading: 'Sponsor an Entire Classroom',
      sponsor_price: '$3,800',
      sponsor_description: 'Fund a teacher, materials, meals, and education for 12&ndash;15 children for a full year.',
      sponsor_button_text: 'Sponsor a Classroom',
      donate_transparency_heading: 'Where your donation goes',
      donate_bar1_label: 'Teacher compensation',
      donate_bar1_amount: '62%',
      donate_bar2_label: 'Truck &amp; maintenance',
      donate_bar2_amount: '10%',
      donate_bar3_label: 'Training &amp; development',
      donate_bar3_amount: '9%',
      donate_bar4_label: 'Administrator compensation',
      donate_bar4_amount: '6%',
      donate_bar5_label: 'Nutrition, water &amp; upgrades',
      donate_bar5_amount: '6%',
      mail_heading: 'Mail a check',
      mail_address: 'Let\'s Be Ready #3259-6581<br>Charles Schwab &amp; Co Inc<br>PO Box 982600, El Paso, TX 79998',
      other_platforms_heading: 'Other platforms',
      other_platforms_note: 'Higher fees apply:',
      contact_eyebrow: 'Questions?',
      contact_heading: 'Get in touch',
      fee_note: 'Most donors choose to cover the processing fee, so <strong>100% reaches children</strong>.',

      // Lifetime impact (placeholders — editors update annually from annual report)
      lifetime_eyebrow: 'Since 2008',
      lifetime_heading: 'Lifetime Impact',
      lifetime_stat1_value: '$1.2M+',
      lifetime_stat1_label: 'Raised since 2008',
      lifetime_stat2_value: '3,400+',
      lifetime_stat2_label: 'Children educated',
      lifetime_stat3_value: '180+',
      lifetime_stat3_label: 'Classrooms funded',

      // Partners page
      partners_eyebrow: 'Together We Go Further',
      partners_heading: 'Our Partners &amp; Supporters',
      partners_intro: 'We\'re grateful for the organizations and individuals who make our mission possible. Every partnership strengthens our ability to bring preschool education to rural Guatemala.',
      partner_cta_heading: 'Become a Partner',
      partner_cta_text: 'Interested in supporting preschool education in rural Guatemala? We\'d love to hear from you. Whether you\'re a foundation, corporation, church, or individual &mdash; there\'s a way to get involved.',
      partner_cta_button: 'Get in Touch',

      // Nutrition page
      nutrition_hero_image: 'assets/nutrition-hero.jpg',
      nutrition_hero_image_alt: 'A young girl in rural Guatemala holding food',
      nutrition_turn_image: 'assets/nutrition-supplies.jpg',
      nutrition_turn_image_alt: 'Community members with bags of food supplies for classrooms',
      nutrition_headline: 'You can\'t learn<br>when you\'re hungry.',
      nutrition_subheadline: 'In rural Guatemala, nearly half of indigenous children suffer from chronic malnutrition. We make sure every child eats before they learn.',
      nutrition_stat1_value: '47%',
      nutrition_stat1_context: 'of indigenous children under 5 in Guatemala suffer from chronic malnutrition',
      nutrition_stat2_value: '58%',
      nutrition_stat2_context: 'of rural Mayan children are stunted before they ever reach a classroom',
      nutrition_turn_heading: 'So we <em>feed<br>them first.</em>',
      nutrition_turn_text: 'Every child in every classroom receives a daily nutritious meal before learning begins. Locally sourced, teacher-led, consistent. No child in our program goes hungry.',
      nutrition_feed_stat1_value: '600+',
      nutrition_feed_stat1_label: 'children fed daily',
      nutrition_feed_stat2_value: '45',
      nutrition_feed_stat2_label: 'classrooms served',
      nutrition_feed_stat3_value: '5',
      nutrition_feed_stat3_label: 'departments',
      nutrition_cta_heading: 'A full stomach<br>changes everything.',
      nutrition_cta_button: 'Donate Now',
      nutrition_intro: 'Chronic malnutrition is one of the biggest barriers to education in rural Guatemala. Our nutrition program ensures every child in every classroom eats before they learn.',
      nutrition_problem_heading: 'Guatemala has the highest rate of<br>child malnutrition in Latin America',
      nutrition_approach_heading: 'Nutrition is built into every classroom',
      nutrition_quote: '&ldquo;When the children eat first, everything changes. They pay attention. They participate. They smile.&rdquo;',
      nutrition_quote_cite: '&mdash; Community facilitator, Chimaltenango',

      // Curriculum / Education+ page
      curriculum_hero_image: 'https://static.wixstatic.com/media/b86cca_62cd990a9ac24c0e9f57b707a375c718~mv2.jpg/v1/fill/w_1920,h_1280,al_c,q_85/20240313_142741-1-2-scaled.jpg',
      curriculum_hero_image_alt: 'Children learning hands-on in a Let\'s Be Ready classroom',
      curriculum_headline: 'More than ABCs.<br><em>The whole child.</em>',
      curriculum_subheadline: 'Reading and writing are just the beginning. Our curriculum builds healthy bodies, curious minds, and capable hearts &mdash; through gardening, nutrition, art, and social-emotional learning.',

      curriculum_intro_lead: 'A child who learns to <em>grow her own food</em>, <em>nourish her body</em>, and <em>name her feelings</em> is ready for far more than first grade.',
      curriculum_intro_sub: 'Education+ is what we call the extension activities woven into every classroom day. They turn a preschool into a launchpad for lifelong wellbeing.',

      curriculum_pillar1_title: 'Gardening',
      curriculum_pillar1_desc: 'Children plant, tend, and harvest in classroom gardens &mdash; learning where food comes from with their hands in the dirt.',
      curriculum_pillar2_title: 'Nutritional Education',
      curriculum_pillar2_desc: 'Lessons that turn every snack into a teaching moment about food groups, hydration, and healthy choices.',
      curriculum_pillar3_title: 'Art &amp; Creativity',
      curriculum_pillar3_desc: 'Drawing, painting, music, and movement &mdash; the universal languages of curious minds.',
      curriculum_pillar4_title: 'Social-Emotional',
      curriculum_pillar4_desc: 'Naming feelings, sharing, taking turns, and resolving conflict &mdash; the skills that hold a classroom together.',

      curriculum_garden_eyebrow: 'Hands in the Dirt',
      curriculum_garden_heading: 'Every classroom grows a garden.',
      curriculum_garden_text: 'In rural Mayan communities, gardening isn\'t a hobby &mdash; it\'s survival. We teach children to grow vegetables, herbs, and native crops alongside the curriculum, planting skills they\'ll use for the rest of their lives.',
      curriculum_garden_image: 'https://static.wixstatic.com/media/b86cca_e222394152f44f719607544671f2bca9~mv2.jpg/v1/fill/w_800,h_1000,al_c,q_85/Our-approach-in-guatermala-2024.jpg',
      curriculum_garden_image_alt: 'Children tending a classroom garden',
      curriculum_garden_point1: 'Seed-to-plate cycles built into the school year',
      curriculum_garden_point2: 'Native crops &mdash; corn, beans, squash, herbs',
      curriculum_garden_point3: 'Harvests feed back into classroom snacks',

      curriculum_nuted_eyebrow: 'Food Is a Lesson',
      curriculum_nuted_heading: 'Nutritional education at every meal.',
      curriculum_nuted_text: 'Snack time isn\'t a break from learning &mdash; it\'s part of it. Teachers turn each meal into a lesson about food groups, water, and the connection between eating well and feeling well.',
      curriculum_nuted_image: 'assets/nutrition-classroom.jpg',
      curriculum_nuted_image_alt: 'Children eating a nutritious snack in the classroom',
      curriculum_nuted_point1: 'Daily lessons on food groups and hydration',
      curriculum_nuted_point2: 'Hand-washing and hygiene routines',
      curriculum_nuted_point3: 'Family take-home nutrition guidance',

      curriculum_supplement_badge: 'Featured',
      curriculum_supplement_heading: 'The nutritional <em>supplement</em> that closes the gap.',
      curriculum_supplement_text: 'Even with daily meals, many children arrive too undernourished for snacks alone to make a difference. That\'s why every student in our program receives a fortified nutritional supplement &mdash; vitamins, minerals, and protein delivered through a packed nutrition product donated by a generous partner.',
      curriculum_supplement_note: 'In-kind donation from a long-standing partner. 100% of the supplement reaches children at no cost to the program.',
      curriculum_supplement_stat1_value: '600+',
      curriculum_supplement_stat1_label: 'Children receiving the supplement daily',
      curriculum_supplement_stat2_value: '45',
      curriculum_supplement_stat2_label: 'Classrooms stocked across 5 departments',
      curriculum_supplement_stat3_value: '$0',
      curriculum_supplement_stat3_label: 'Cost to the program — fully donated in-kind',

      curriculum_cta_heading: 'Help us grow <em>more than gardens.</em>',
      curriculum_cta_text: 'Your donation funds the curriculum, the materials, the meals, and the hands that bring it all together.',
      curriculum_cta_button: 'Donate Now',

      // Staff page (controlled by Sanity staffPage singleton)
      // Default OFF — flip the toggle in Sanity once content is ready.
      show_staff_link: false,
      staff_link_text: 'Meet our full staff &rarr;',
      staff_eyebrow: 'Our People',
      staff_heading: 'The faces behind <em>every classroom.</em>',
      staff_intro: 'From teachers in remote villages to coordinators on the road every week &mdash; this is the team that makes the work possible. Replace the placeholders below with real staff in the Sanity Studio.',
    },
    team_members: [
      {
        name: 'Garrett Reed',
        role: 'Executive Director',
        bio: '30+ years as a teacher and trainer, working with immigrant and refugee students from Latin America.',
        photo_url: 'https://static.wixstatic.com/media/b86cca_b2b0b92f951a49b58fd9b13fa5451327~mv2.png/v1/fill/w_200,h_200,al_c,q_85/Screen%20Shot%202025-03-21%20at%2012_08_07%20PM.png',
        active: true,
      },
      {
        name: 'Sara Tun',
        role: 'Program Administrator, Chimaltenango & Sacatep\u00e9quez',
        bio: 'With sixteen years experience, Sarita administers 26 classrooms in two departments.',
        photo_url: 'https://static.wixstatic.com/media/b86cca_5318727af2474f878016b2f3f25aa61f~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80/3dd7b745-361b-4106-a3aa-0d12407f3a7c_JPG.jpg',
        active: true,
      },
      {
        name: 'Lucila Diaz',
        role: 'Administrator, Huehuetenango, Solol\u00e1 & Quich\u00e9',
        bio: 'Lucy has been with Let\u2019s Be Ready for 15 years. As a curriculum specialist, Lucy oversees yearly updates to our curriculum and travels extensively to meet with and support teachers.',
        photo_url: 'https://static.wixstatic.com/media/b86cca_527419ab121c4c938652b89e1b7eedea~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80/IMG_20240801_155859.jpg',
        active: true,
      },
      {
        name: 'Fred Zambroski',
        role: 'Founder',
        bio: '&ldquo;This project was started by a Guatemalan woman and is currently run by Guatemalan women.&rdquo;',
        photo_url: 'https://static.wixstatic.com/media/b86cca_d6bf45f20b3949b38c1015d5323e8134~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80/IMG_0708-1536x1283-1.jpg',
        active: true,
      },
    ],
    partners: [
      { name: 'GlobalGiving', description: 'International crowdfunding platform connecting nonprofits with donors worldwide.', logo_url: '' },
      { name: 'DonorSee', description: 'Transparent giving platform that lets donors see their impact in real time.', logo_url: '' },
      { name: 'Rotary Club of Bellaire', description: 'Local service organization supporting community education initiatives.', logo_url: '' },
      { name: 'Guatemala Ministry of Education', description: 'Government partnership for curriculum alignment and teacher certification.', logo_url: '' },
      { name: 'Community Leaders Network', description: 'Network of village leaders who identify and support local facilitators.', logo_url: '' },
      { name: 'Charles Schwab Foundation', description: 'Financial services partner providing secure fund management and transfers.', logo_url: '' },
    ],
    expense_allocation: [
      { label: 'Teacher compensation', percent: 62, color: '#146BF6' },
      { label: 'Truck & maintenance', percent: 10, color: '#8b5cf6' },
      { label: 'Training & development', percent: 9, color: '#FFE500' },
      { label: 'Administrator compensation', percent: 6, color: '#16a34a' },
      { label: 'Other operating', percent: 5, color: '#F59E0B' },
      { label: 'Classroom upgrades', percent: 3, color: '#EC4899' },
      { label: 'Nutrition & water', percent: 3, color: '#06B6D4' },
      { label: 'Administration expenses', percent: 2, color: '#64748b' },
    ],
    classrooms: null, // Will be loaded from classrooms.json or Classrooms tab
    staff_members: [
      { name: 'Placeholder One', role: 'Lead Teacher', region: 'Chimaltenango', bio: '', photo_url: '', initials: 'PO' },
      { name: 'Placeholder Two', role: 'Lead Teacher', region: 'Sacatepéquez', bio: '', photo_url: '', initials: 'PT' },
      { name: 'Placeholder Three', role: 'Field Coordinator', region: 'Sololá', bio: '', photo_url: '', initials: 'PT' },
      { name: 'Placeholder Four', role: 'Lead Teacher', region: 'Quiché', bio: '', photo_url: '', initials: 'PF' },
      { name: 'Placeholder Five', role: 'Cook', region: 'Huehuetenango', bio: '', photo_url: '', initials: 'PF' },
      { name: 'Placeholder Six', role: 'Lead Teacher', region: 'Chimaltenango', bio: '', photo_url: '', initials: 'PS' },
    ],
  };
}


// --- Sanity data fetching ---

/**
 * Run a GROQ query against the Sanity HTTP API and return the result.
 * No SDK, just fetch. Reads from public dataset by default; if a token
 * is set in env, uses it as a Bearer auth header.
 *
 * @param {string} query - GROQ query string
 * @returns {Promise<any>} Whatever the query returns (single doc, array, count, etc.)
 */
async function sanityFetch(query) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const headers = SANITY_API_TOKEN ? { Authorization: `Bearer ${SANITY_API_TOKEN}` } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Sanity fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.result;
}

/**
 * Build a Sanity CDN image URL from a Sanity image field value.
 * Sanity stores images as { asset: { _ref: 'image-{id}-{dimensions}-{ext}' } }.
 * We parse that ref and produce a public CDN URL pointing at the original.
 *
 * @param {object} image - Sanity image field value
 * @returns {string} CDN URL or empty string if the input wasn't a valid image
 */
function sanityImageUrl(image) {
  if (!image || !image.asset || !image.asset._ref) return '';
  const ref = image.asset._ref;
  // image-{id}-{dimensions}-{extension}
  const [, id, dimensions, ext] = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/) || [];
  if (!id) return '';
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${ext}`;
}

/**
 * Walk a Sanity document and replace any image-field objects with their
 * CDN URL string. Mutates nothing; returns a flat copy with the same
 * field names. This is what lets templates use {{hero_image}} as a
 * string instead of having to know the Sanity image asset shape.
 *
 * @param {object} doc - A Sanity document object
 * @returns {object} A new object with image fields converted to URL strings
 */
function flattenImages(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const out = {};
  for (const [key, value] of Object.entries(doc)) {
    if (value && typeof value === 'object' && value.asset && value.asset._ref) {
      const url = sanityImageUrl(value);
      out[key] = url;
      // Templates aren't consistent about naming: index.html asks for
      // {{hero_image_url}} while the Sanity field is called hero_image, but
      // curriculum.html asks for {{curriculum_hero_image}} directly. Publish
      // both spellings so an uploaded image reaches the page either way.
      // Without this, the _url templates silently kept rendering the old
      // hardcoded photos no matter what an editor uploaded.
      if (!key.endsWith('_url')) out[`${key}_url`] = url;
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * True for content keys that hold a photo rather than text.
 *
 * Text and images need opposite fallback rules. Deleting text in the Studio
 * should delete it on the site, so missing text resolves to empty. Images
 * are different: no template guards its <img> with an {{#if}}, so blanking a
 * photo the editor never uploaded would render a broken image. For those we
 * keep the built-in default and let Sanity override it when one exists.
 *
 * Matches hero_image, hero_image_url, logo_url, favicon_url — but not
 * hero_image_alt, which is text.
 */
function isImageKey(key) {
  return /(^|_)(image|logo|favicon|photo)(_url)?$/.test(key);
}

/**
 * Fetch the entire site's content from Sanity in parallel.
 *
 * Pulls every singleton (homepage, donatePage, etc.) and every collection
 * (classroom, teamMember, etc.) in one Promise.all. Flattens singletons
 * into a single content key/value object so templates can reference
 * fields by name. Maps collection docs into the array shapes the
 * templates expect.
 *
 * Falls back to getFallbackData() values for any collection that comes
 * back empty, so a partially-empty Sanity dataset still produces a
 * usable site.
 *
 * @returns {Promise<object>} Same shape as getFallbackData()
 */
async function fetchSanityData() {
  console.log(`Fetching content from Sanity (project: ${SANITY_PROJECT_ID}, dataset: ${SANITY_DATASET})...`);

  const fallback = getFallbackData();

  // Pull all docs in parallel.
  const [
    siteSettings,
    homepage,
    nutritionPage,
    curriculumPage,
    donatePage,
    partnersPage,
    staffPageDoc,
    classroomDocs,
    teamDocs,
    staffDocs,
    partnerDocs,
    expenseDocs,
  ] = await Promise.all([
    sanityFetch(`*[_type == "siteSettings"][0]`),
    sanityFetch(`*[_type == "homepage"][0]`),
    sanityFetch(`*[_type == "nutritionPage"][0]`),
    sanityFetch(`*[_type == "curriculumPage"][0]`),
    sanityFetch(`*[_type == "donatePage"][0]`),
    sanityFetch(`*[_type == "partnersPage"][0]`),
    sanityFetch(`*[_type == "staffPage"][0]`),
    sanityFetch(`*[_type == "classroom"] | order(department asc, community asc)`),
    sanityFetch(`*[_type == "teamMember" && active == true] | order(order asc)`),
    sanityFetch(`*[_type == "staffMember" && active == true] | order(order asc)`),
    sanityFetch(`*[_type == "partner"] | order(order asc)`),
    sanityFetch(`*[_type == "expenseItem"] | order(order asc)`),
  ]);

  // Flatten all singletons into a flat content map keyed by field name (matches templates).
  //
  // Only the photo defaults are seeded here, NOT the fallback text. Sanity is
  // the source of truth for copy: if an editor clears a field in the Studio,
  // the field is removed from the document, and the site must show nothing
  // rather than quietly reverting to the sample copy baked into this file.
  // Seeding all of fallback.content here is what made deleted text immortal.
  const imageDefaults = {};
  for (const [key, value] of Object.entries(fallback.content)) {
    if (isImageKey(key)) imageDefaults[key] = value;
  }

  const content = {
    ...imageDefaults,
    ...flattenImages(siteSettings || {}),
    ...flattenImages(homepage || {}),
    ...flattenImages(nutritionPage || {}),
    ...flattenImages(curriculumPage || {}),
    ...flattenImages(donatePage || {}),
    ...flattenImages(partnersPage || {}),
    ...flattenImages(staffPageDoc || {}),
  };

  // Any remaining key a template might reference resolves to an empty string.
  // Without this the substitution pass leaves the literal {{key}} on the page
  // (see processTemplate), and {{#if key}} blocks correctly render nothing.
  // copyright_year and show_staff_link are computed a few lines below, so they
  // are expected to be missing here and aren't worth reporting.
  const COMPUTED_KEYS = ['copyright_year', 'show_staff_link'];
  const cleared = [];
  for (const key of Object.keys(fallback.content)) {
    if (content[key] === undefined) {
      content[key] = '';
      if (!COMPUTED_KEYS.includes(key)) cleared.push(key);
    }
  }
  if (cleared.length) {
    console.log(`Empty in Sanity (rendering blank): ${cleared.length} field(s)`);
    console.log(`  ${cleared.join(', ')}`);
  }

  // Photos still on a built-in default because nothing was uploaded in Sanity.
  const stockPhotos = Object.keys(imageDefaults).filter(
    (k) => content[k] === imageDefaults[k] && /^https?:/.test(String(imageDefaults[k] || '')),
  );
  if (stockPhotos.length) {
    console.log(`Photos not yet uploaded to Sanity (using built-in default): ${stockPhotos.length}`);
    console.log(`  ${stockPhotos.join(', ')}`);
  }

  // Synthesize the show_staff_link key from the staffPage.enabled toggle.
  // Falsey values: undefined, null, false, '' — anything else means show.
  content.show_staff_link = staffPageDoc && staffPageDoc.enabled === true;

  // Special-case: site settings stores images as objects, templates expect URL strings
  if (siteSettings) {
    if (siteSettings.logo) content.logo_url = sanityImageUrl(siteSettings.logo);
    if (siteSettings.favicon) content.favicon_url = sanityImageUrl(siteSettings.favicon);
    if (siteSettings.og_image) content.og_image_url = sanityImageUrl(siteSettings.og_image);
  }
  // Always set copyright year
  content.copyright_year = new Date().getFullYear().toString();

  // Map collection docs to the array shapes the templates expect.
  // Not every board member has uploaded a photo. The staff page already
  // handles that by falling back to initials in a coloured circle; the
  // homepage grid rendered a bare <img src=""> instead, which browsers draw
  // as a broken image. Supply the same initials so it can do the same.
  const team_members = (teamDocs || []).map((t) => {
    const name = t.name || '';
    const photo_url = sanityImageUrl(t.photo) || '';
    return {
      name,
      role: t.role || '',
      bio: t.bio || '',
      photo_url,
      no_photo: !photo_url,
      initials: name.split(/\s+/).filter(Boolean).map((n) => n[0]).join('').toUpperCase().substring(0, 2),
    };
  });

  const staff_members = (staffDocs || []).map((s) => {
    const name = s.name || '';
    return {
      name,
      role: s.role || '',
      region: s.region || '',
      bio: s.bio || '',
      photo_url: sanityImageUrl(s.photo) || '',
      initials: name.split(/\s+/).filter(Boolean).map((n) => n[0]).join('').toUpperCase().substring(0, 2),
    };
  });

  const partners = (partnerDocs || []).map((p) => ({
    name: p.name || '',
    description: p.description || '',
    logo_url: sanityImageUrl(p.logo) || '',
  }));

  const expense_allocation = (expenseDocs || []).map((e) => ({
    label: e.label || '',
    percent: typeof e.percent === 'number' ? e.percent : parseFloat(e.percent) || 0,
    color: e.color || '#ccc',
  }));

  let classrooms = null;
  if (classroomDocs && classroomDocs.length > 0) {
    const list = classroomDocs.map((c, i) => ({
      id: c.classroomId || i + 1,
      community: c.community || '',
      department: c.department || '',
      teacher: c.teacher || '',
      students: typeof c.students === 'number' ? c.students : 0,
      lat: typeof c.lat === 'number' ? c.lat : 0,
      lng: typeof c.lng === 'number' ? c.lng : 0,
      year: typeof c.year === 'number' ? c.year : 2024,
    }));
    classrooms = {
      meta: {
        total_classrooms: list.length,
        total_students: list.reduce((sum, c) => sum + c.students, 0),
        total_teachers: list.length,
        departments: new Set(list.map((c) => c.department)).size,
        updated: new Date().toISOString().slice(0, 7),
      },
      classrooms: list,
    };
  }

  // Carousel galleries on the Programs page. Each is an array of images
  // in Sanity; build() falls back to the section's single image when empty.
  const toGallery = (arr) =>
    (arr || []).map((img) => ({ url: sanityImageUrl(img) })).filter((g) => g.url);
  const garden_gallery = toGallery((curriculumPage || {}).curriculum_garden_gallery);
  const nuted_gallery = toGallery((curriculumPage || {}).curriculum_nuted_gallery);

  // Instagram post links for the homepage "From the Classroom" band.
  // Editors paste URLs as the browser shows them (instagram.com/account/p/CODE/),
  // but embed.js only reliably renders the canonical instagram.com/p/CODE/ form.
  const instagram_posts = ((homepage || {}).instagram_posts || [])
    .filter((u) => typeof u === 'string' && /^https?:\/\//.test(u))
    .map((url) => {
      const m = url.match(/instagram\.com\/(?:[^/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/i);
      return { url: m ? `https://www.instagram.com/${m[1].toLowerCase()}/${m[2]}/` : url };
    });

  // Apply collection fallbacks if Sanity returned empty
  return {
    content,
    team_members: team_members.length > 0 ? team_members : fallback.team_members,
    staff_members: staff_members.length > 0 ? staff_members : fallback.staff_members,
    partners: partners.length > 0 ? partners : fallback.partners,
    expense_allocation: expense_allocation.length > 0 ? expense_allocation : fallback.expense_allocation,
    classrooms,
    garden_gallery,
    nuted_gallery,
    instagram_posts,
  };
}


// --- Pie chart generator ---

/**
 * Build an inline SVG donut chart for the homepage transparency section.
 * Each item is a slice. Uses stroke-dasharray + dashoffset to draw arcs
 * along a single circle, which is the smallest-code way to render a donut
 * chart in SVG without a library.
 *
 * @param {Array<{label:string, percent:number, color:string}>} items
 * @returns {{svg:string, legend:string}} Two HTML strings the templates inject
 */
function generatePieChart(items) {
  const R = 80;
  const C = 2 * Math.PI * R; // ~502.65
  let offset = C / 4; // start at top (90° = quarter circumference)

  const ariaLabel = 'Expense breakdown: ' + items.map(i => `${i.label} ${i.percent}%`).join(', ');

  let circles = '';
  for (const item of items) {
    const dash = (item.percent / 100) * C;
    const gap = C - dash;
    circles += `\n                <circle cx="100" cy="100" r="${R}" fill="none" stroke="${item.color}" stroke-width="36" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" />`;
    offset -= dash;
  }

  const svg = `<div class="pie-chart" role="img" aria-label="${ariaLabel}">
              <svg viewBox="0 0 200 200" width="180" height="180">${circles}
                <circle cx="100" cy="100" r="62" fill="var(--white)" />
                <text x="100" y="93" text-anchor="middle" fill="var(--dark)" font-size="14" font-weight="700">$249k</text>
                <text x="100" y="112" text-anchor="middle" fill="var(--text-muted)" font-size="10">spent in 2025</text>
              </svg>
            </div>`;

  const legend = `<div class="pie-chart__legend">
${items.map(i => `              <div class="pie-chart__item"><span class="pie-chart__dot" style="background:${i.color};"></span> ${i.label} <strong>${i.percent}%</strong></div>`).join('\n')}
            </div>`;

  return { svg, legend };
}


// --- Homepage-only keys ---

/**
 * A few homepage values are needed in a shape the editor doesn't store:
 * the map heading on one line, and the animated counters split into the
 * number that counts up and the suffix that doesn't ("550+" → 550, "+").
 */
function deriveHomepageKeys(c) {
  c.map_heading_inline = String(c.map_heading || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // The About page sets its statement as one sentence; the editor's field
  // carries line breaks meant for the old centered stack.
  c.turn_question_inline = String(c.turn_question || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const key of ['stat_pass_rate', 'stat_children']) {
    const m = String(c[key] || '').trim().match(/^([^\d]*)(\d[\d,]*)(.*)$/);
    c[`${key}_num`] = m ? m[2].replace(/,/g, '') : '0';
    c[`${key}_prefix`] = m ? m[1].trim() : '';
    c[`${key}_suffix`] = m ? m[3].trim() : '';
  }
}

// --- Template engine ---

/**
 * Tiny Mustache-style template processor. Supports:
 *   {{key}}                     simple value substitution from data.content
 *   {{#each collection}}...{{/each}}   loop over data[collection]
 *   {{#if key}}...{{/if}}       conditional render (top-level or inside #each)
 *
 * Substitution runs in a do/while loop until stable, so an injected
 * partial (e.g. {{footer_html}} containing its own keys like
 * {{contact_email}}) gets fully resolved in subsequent passes.
 *
 * Truthy in if-blocks: anything that isn't undefined/null/false/empty
 * string/the literal string 'false'.
 *
 * @param {string} template - Raw template HTML
 * @param {object} data - { content: {key:value, ...}, [collection]: [...] }
 * @returns {string} Rendered HTML
 */
function processTemplate(template, data) {
  let html = template;

  // 1. Process {{#each collection}}...{{/each}} blocks
  html = html.replace(
    /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (match, collectionName, blockTemplate) => {
      const collection = data[collectionName];
      if (!Array.isArray(collection) || collection.length === 0) return '';

      return collection.map(item => {
        let itemHtml = blockTemplate;

        // Process {{#if field}}...{{/if}} within each block
        itemHtml = itemHtml.replace(
          /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
          (m, field, content) => {
            return item[field] ? content : '';
          }
        );

        // Replace {{field}} with item values
        itemHtml = itemHtml.replace(/\{\{(\w+)\}\}/g, (m, key) => {
          return item[key] !== undefined ? item[key] : '';
        });

        return itemHtml;
      }).join('');
    }
  );

  // 2. Resolve {{#if key}}...{{/if}} blocks and {{key}} substitutions together,
  // looping until the output stops changing.
  //
  // These have to interleave rather than run as separate passes. Partials are
  // injected as ordinary content keys ({{footer_html}}), so a partial's own
  // {{#if}} blocks don't exist in the page until a substitution pass has pulled
  // the partial in. Running all the #if handling first meant any conditional
  // inside _footer.html survived into the finished HTML as literal text.
  const content = data.content || {};
  let prev;
  let safety = 10;
  do {
    prev = html;

    html = html.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (m, key, body) => {
        const val = content[key];
        // Truthy in our content sense: non-empty string, true boolean, non-zero number
        if (val === undefined || val === null || val === false || val === '' || val === 'false') {
          return '';
        }
        return body;
      }
    );

    html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return content[key] !== undefined ? content[key] : match;
    });

    safety--;
  } while (html !== prev && safety > 0);

  return html;
}


// --- File operations ---

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFileSync(src, dest) {
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}


// --- Main build ---

/**
 * Main build entrypoint. Run via `node build.js` or `npm run build`.
 *
 * Pipeline:
 *   1. Fetch content (Sanity if env set, else static fallback)
 *   2. Generate the pie chart SVG and inject it as a content key
 *   3. Inject the canonical footer partial as a content key
 *   4. Render every template in templates/ to dist/
 *   5. Write classrooms.json for the Leaflet map
 *   6. Copy static files and asset directories to dist/
 */
/**
 * Fetch each Instagram post's photo at build time so the homepage band can
 * render quiet self-hosted image tiles instead of Instagram's embed card.
 *
 * Instagram serves og:image metadata to link-preview crawlers (that's how
 * WhatsApp/Slack previews work), while plain browser-UA fetches get a login
 * shell — so this request must identify as facebookexternalhit.
 *
 * Mutates each post in place: on success sets `image` (local dist path),
 * `alt`, and stashes the downloaded bytes on `_bytes` for build() to write
 * after the dist directory exists. On any failure the post keeps
 * `needs_embed`, which makes the template fall back to the official embed —
 * the band degrades, it never disappears.
 */
const IG_CRAWLER_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

async function resolveInstagramTiles(posts) {
  for (const post of posts) {
    post.image = '';
    post.needs_embed = '1';
    try {
      const m = post.url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/i);
      if (!m) continue;
      const code = m[2];
      const res = await fetch(post.url, {
        headers: { 'User-Agent': IG_CRAWLER_UA, 'Accept-Language': 'en-US,en;q=0.9' },
      });
      if (!res.ok) {
        console.warn(`Instagram tile: post page ${res.status} for ${post.url}`);
        continue;
      }
      const html = await res.text();
      const imgTag = (html.match(/<meta[^>]+og:image[^>]*>/) || [])[0];
      const src = imgTag && (imgTag.match(/content="([^"]+)"/) || [])[1];
      if (!src) {
        console.warn(`Instagram tile: no og:image served for ${post.url}`);
        continue;
      }
      const imgRes = await fetch(src.replace(/&amp;/g, '&'), {
        headers: { 'User-Agent': IG_CRAWLER_UA },
      });
      if (!imgRes.ok) {
        console.warn(`Instagram tile: photo fetch ${imgRes.status} for ${post.url}`);
        continue;
      }
      post._bytes = Buffer.from(await imgRes.arrayBuffer());
      const titleTag = (html.match(/<meta[^>]+og:title[^>]*>/) || [])[0];
      const rawAlt = (titleTag && (titleTag.match(/content="([^"]+)"/) || [])[1]) || '';
      post.alt =
        rawAlt.replace(/&amp;/g, '&').replace(/["<>]/g, '').slice(0, 300) ||
        "Instagram post from Let's Be Ready";
      post.image = `assets/ig-${code}.jpg`;
      post.needs_embed = '';
      console.log(`Instagram tile: ${code} (${Math.round(post._bytes.length / 1024)} KB)`);
    } catch (e) {
      console.warn(`Instagram tile failed for ${post.url}: ${e.message}`);
    }
  }
}

async function build() {
  console.log('Building Let\'s Be Ready website...\n');

  // 1. Fetch content from Sanity, falling back to static data for local dev
  const data = SANITY_PROJECT_ID ? await fetchSanityData() : getFallbackData();
  console.log(`Content keys: ${Object.keys(data.content).length}`);
  console.log(`Team members: ${data.team_members.length}`);
  console.log(`Expense items: ${data.expense_allocation.length}`);

  // Generate pie chart SVG and inject into content
  const pieChart = generatePieChart(data.expense_allocation);
  data.content.pie_chart_svg = pieChart.svg;
  data.content.pie_chart_legend = pieChart.legend;

  // Programs-page carousels: guarantee at least one slide (the section's
  // single image) and give every slide the section's alt text.
  const c = data.content;
  deriveHomepageKeys(c);
  const withAlt = (slides, alt) => slides.map((s) => ({ ...s, alt: s.alt || alt || '' }));
  data.garden_gallery = withAlt(
    data.garden_gallery && data.garden_gallery.length
      ? data.garden_gallery
      : [{ url: c.curriculum_garden_image }],
    c.curriculum_garden_image_alt,
  );
  data.nuted_gallery = withAlt(
    data.nuted_gallery && data.nuted_gallery.length
      ? data.nuted_gallery
      : [{ url: c.curriculum_nuted_image }],
    c.curriculum_nuted_image_alt,
  );

  // Homepage Instagram band renders only when posts are configured.
  data.instagram_posts = data.instagram_posts || [];
  c.has_instagram = data.instagram_posts.length > 0;

  // Self-host each post's photo so the band shows quiet image tiles.
  // Posts whose photo can't be fetched fall back to the official embed,
  // and only that fallback needs Instagram's script.
  await resolveInstagramTiles(data.instagram_posts);
  c.has_instagram_fallback = data.instagram_posts.some((p) => p.needs_embed) ? '1' : '';

  // 2. Clean and create dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  ensureDir(DIST_DIR);

  // Team page: people grouped by the role they carry in the editor, in the
  // order roles first appear. Each group renders through the _team-group
  // partial (the template engine doesn't nest loops). A group of one gets
  // the featured layout.
  const groupPath = path.join(TEMPLATES_DIR, '_team-group.html');
  if (fs.existsSync(groupPath)) {
    const groupTpl = fs.readFileSync(groupPath, 'utf-8');
    const groups = [];
    for (const m of data.team_members) {
      const role = (m.role || '').trim() || 'Team';
      let g = groups.find((x) => x.role === role);
      if (!g) { g = { role, members: [] }; groups.push(g); }
      g.members.push(m);
    }
    data.content.team_groups_html = groups.map((g) => {
      const plural = g.members.length > 1 && !/s$/i.test(g.role) ? g.role + 's' : g.role;
      return processTemplate(groupTpl, {
        content: { label: plural, single: g.members.length === 1 ? '1' : '' },
        members: g.members,
      });
    }).join('\n');
  }

  // 3. Inject canonical footer partial as a content key (so {{footer_html}} works in every template)
  const footerPath = path.join(TEMPLATES_DIR, '_footer.html');
  if (fs.existsSync(footerPath)) {
    data.content.footer_html = fs.readFileSync(footerPath, 'utf-8');
  }

  // 4. Process templates (skip files starting with _ — they're partials)
  const templateFiles = ['index.html', 'about.html', 'programs.html', 'team.html', 'team2.html', 'donate.html', 'partners.html', 'staff.html'];
  for (const file of templateFiles) {
    const templatePath = path.join(TEMPLATES_DIR, file);
    if (!fs.existsSync(templatePath)) {
      console.warn(`Template not found: ${file}, copying source file instead.`);
      // Fall back to source file if template doesn't exist yet
      const srcPath = path.join(__dirname, file);
      if (fs.existsSync(srcPath)) {
        copyFileSync(srcPath, path.join(DIST_DIR, file));
      }
      continue;
    }

    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = processTemplate(template, data);
    fs.writeFileSync(path.join(DIST_DIR, file), html);
    console.log(`Generated: ${file}`);
  }

  // 4. Generate classrooms.json
  if (data.classrooms) {
    fs.writeFileSync(
      path.join(DIST_DIR, 'classrooms.json'),
      JSON.stringify(data.classrooms, null, 2)
    );
    console.log(`Generated: classrooms.json (${SANITY_PROJECT_ID ? 'from Sanity' : 'from Sheets'})`);
  } else {
    // Copy existing classrooms.json
    const srcJson = path.join(__dirname, 'classrooms.json');
    if (fs.existsSync(srcJson)) {
      copyFileSync(srcJson, path.join(DIST_DIR, 'classrooms.json'));
      console.log('Copied: classrooms.json (from file)');
    }
  }

  // 5. Copy static assets
  for (const file of STATIC_FILES) {
    const srcPath = path.join(__dirname, file);
    if (fs.existsSync(srcPath)) {
      copyFileSync(srcPath, path.join(DIST_DIR, file));
      console.log(`Copied: ${file}`);
    }
  }

  for (const dir of STATIC_DIRS) {
    const srcPath = path.join(__dirname, dir);
    if (fs.existsSync(srcPath)) {
      copyDirSync(srcPath, path.join(DIST_DIR, dir));
      console.log(`Copied: ${dir}/`);
    }
  }

  // 6. Write the self-hosted Instagram photos (bytes fetched in step 1)
  const igTiles = (data.instagram_posts || []).filter((p) => p._bytes);
  if (igTiles.length) {
    ensureDir(path.join(DIST_DIR, 'assets'));
    for (const p of igTiles) {
      fs.writeFileSync(path.join(DIST_DIR, p.image), p._bytes);
    }
    console.log(`Wrote ${igTiles.length} Instagram photo(s) to assets/`);
  }

  console.log(`\nBuild complete! Output in: ${DIST_DIR}`);
}


// Export helpers so other scripts (e.g. migrate-to-sanity) can reuse them
module.exports = {
  getFallbackData,
  fetchSanityData,
};

// Run only when invoked directly (not when required from another script)
if (require.main === module) {
  build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
}
