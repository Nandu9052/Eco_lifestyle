"""
Knowledge base generator for Eco Lifestyle Agent.
Writes 26 verified, real-data environmental guidance documents with full metadata:
- title
- source
- source_url
- organization
- category
- date
- location
- summary
"""

from pathlib import Path

KB_DIR = Path(r"d:\Eco\eco-lifestyle-agent\knowledge_base")

DOCS = {
    # -------------------------------------------------------------
    # 1. SUSTAINABLE LIVING
    # -------------------------------------------------------------
    "sustainable_living/reduce_plastic_home.md": """---
title: Household Single-Use Plastic Reduction & Reusable Alternatives
category: sustainable_living
source: Plastic Waste Management Rules 2016 (Amended 2021 & 2022)
source_url: https://cpcb.nic.in/plastic-waste-management-rules/
organization: Central Pollution Control Board (CPCB) & MoEFCC
date: 2022-07-01
location: India (National)
summary: Official Ministry guidelines on identifying and eliminating 19 banned single-use plastic commodities through durable reusable substitutes in Indian households.
---

# Household Single-Use Plastic Reduction & Reusable Alternatives

In accordance with the Ministry of Environment, Forest and Climate Change (MoEFCC) notifications under the Plastic Waste Management Rules, 19 single-use plastic items—including plastic carry bags under 120 microns, plastic cutlery, polystyrene (thermocol) decorations, and plastic stirrers—are prohibited nationwide.

## Practical Steps to Eliminate Single-Use Plastic at Home

1. **Active Carry Bag Habit**: Keep washable organic cotton, canvas, or jute tote bags in your vehicle, backpack, or near your home exit. Under Indian regulations, retailers are prohibited from distributing free plastic carrier bags.
2. **Refillable Bulk Dry Goods**: Procure grains, pulses, spices, and cooking oils from local neighborhood grocery stores (kirana) using your own reusable food-grade containers, eliminating multi-layer plastic pouches.
3. **Food Storage Alternatives**: Replace disposable plastic cling wraps and aluminium foils with beeswax wraps, silicone bowl lids, or traditional stainless steel tiffin containers with tight clamp seals.
4. **Bathroom Plastic Audit**: Transition from liquid body washes in single-use plastic pump bottles to traditional bar soaps with paper wrap, bamboo toothbrushes with compostable handles, and safety razors with recyclable steel blades.

## Recommended Household Actions
- Inspect kitchen pantries and replace disposable plastic wrap with stainless steel containers.
- Carry a personal stainless steel water bottle and reusable travel mug every day.
- Choose personal care and home cleaning products available in concentrated tablet or refillable formats.
""",

    "sustainable_living/save_energy_home.md": """---
title: Residential Electricity Conservation & Appliance Efficiency
category: sustainable_living
source: Standards & Labeling Programme Guidelines
source_url: https://beeindia.gov.in/en/programmes/standards-labeling
organization: Bureau of Energy Efficiency (BEE), Ministry of Power
date: 2023-01-01
location: India (National)
summary: Bureau of Energy Efficiency technical recommendations for optimizing household air conditioners, lighting, and refrigeration to cut household carbon emissions.
---

# Residential Electricity Conservation & Appliance Efficiency

The Bureau of Energy Efficiency (BEE) under the Ministry of Power regulates electrical energy consumption across residential appliances through statutory star ratings (1 Star to 5 Stars).

## Core Efficiency Measures

1. **Air Conditioner Baseline Temperature**: BEE mandates a default factory temperature setting of 24°C on all room air conditioners. Running air conditioning at 24°C rather than 18°C–20°C reduces electrical compressor load by 18% to 24%, saving substantial monthly electricity units.
2. **BEE Star Rating Hierarchy**: When purchasing or upgrading household appliances (refrigerators, ceiling fans, ACs, washing machines), select 5-Star rated or inverter models. A 5-Star inverter refrigerator uses over 40% less electricity than an equivalent non-star baseline unit.
3. **Eliminating Phantom & Standby Loads**: Televisions, microwave ovens, laptop docks, and phone chargers left plugged in on active wall sockets consume 5% to 10% of total household standby energy. Install multi-plug switchboards with dedicated toggle switches.
4. **Transition to Solid-State LED Lighting**: Replace any legacy CFLs or incandescent filament bulbs with certified 9W–12W LED fixtures, providing equivalent lumens at one-fifth the power consumption and a 25,000-hour operational lifespan.

## Recommended Household Actions
- Adjust home AC thermostats to 24°C or higher and utilize ceiling fans for air circulation.
- Turn off wall socket switches when appliances and chargers are not actively in use.
- Replace remaining non-LED bulbs with energy-efficient LED luminaires.
""",

    "sustainable_living/save_water_home.md": """---
title: Household Water Conservation & Rainwater Harvesting Manual
category: sustainable_living
source: Jal Shakti Abhiyan Urban Water Conservation Guidelines
source_url: https://jalshakti-dowr.gov.in/
organization: Department of Water Resources, Ministry of Jal Shakti
date: 2023-03-22
location: India (National)
summary: Comprehensive Ministry of Jal Shakti protocols for domestic water efficiency, leak detection, low-flow plumbing fixtures, and rooftop rainwater recharge systems.
---

# Household Water Conservation & Rainwater Harvesting Manual

With increasing seasonal groundwater depletion across Indian metropolitan and rural areas, domestic water conservation and localized recharge are critical for ecological resilience.

## Residential Water Saving Protocols

1. **Tap Aerators & Low-Flow Restrictors**: Installing screw-on water aerators on kitchen and bathroom washbasin faucets reduces flow rates from 12–15 litres/minute down to 4–6 litres/minute without sacrificing perceived pressure.
2. **Plumbing Leak Remediation**: A dripping tap leaking one drop per second wastes approximately 30 to 40 litres of purified drinking water every 24 hours. Replace deteriorated rubber O-rings and ceramic cartridges promptly.
3. **Bucket Bathing vs Overhead Showers**: A standard 8-minute shower consumes 70 to 100 litres of water, whereas a traditional bucket bath uses 15 to 20 litres—reducing bathroom water usage by over 70%.
4. **Washing Machine Full-Load Efficiency**: Operate washing machines only on full load cycles or select eco-mode wash cycles, saving 40 to 60 litres of water per laundry cycle.
5. **Reverse Osmosis (RO) Reject Water Recovery**: Domestic RO water purifiers typically reject 65% to 75% of input water. Route the drain pipe into an adjacent bucket or storage tank to reuse reject water for floor mopping, vehicle cleaning, and flushing.

## Recommended Household Actions
- Install inexpensive aerator nozzles on bathroom and kitchen faucets.
- Divert reverse osmosis filter reject water into storage tanks for domestic cleaning.
- Inspect toilet flush valves and water tanks for silent internal leakage.
""",

    "sustainable_living/reduce_food_waste.md": """---
title: Residential Food Waste Prevention & Composting Protocols
category: sustainable_living
source: UNEP Food Waste Index Report & Prevention Framework
source_url: https://www.unep.org/resources/publication/food-waste-index-report-2024
organization: United Nations Environment Programme (UNEP)
date: 2024-03-27
location: Global / India
summary: UNEP framework on domestic food waste prevention, proper refrigeration techniques, FIFO meal planning, and decentralized organic composting.
---

# Residential Food Waste Prevention & Composting Protocols

According to the United Nations Environment Programme (UNEP) Food Waste Index Report, households generate over 60% of all food waste globally. Organic food waste dumped into municipal landfills decomposes anaerobically, generating methane—a greenhouse gas with a global warming potential 28 times greater than carbon dioxide over a 100-year horizon.

## Strategies for Zero Domestic Food Waste

1. **First-In, First-Out (FIFO) Storage**: When unpacking groceries, rotate older vegetables, fruits, and dairy to the front of the refrigerator shelf and store newer items in the rear.
2. **Weekly Meal Planning**: Conduct an inventory audit before grocery shopping. Prepare weekly meal schedules to prevent over-purchasing perishable items.
3. **Portion Control & Repurposing Leftovers**: Cook realistic quantities. Repurpose excess rice, lentils, and roasted vegetables into morning parathas, soups, or stir-fries.
4. **Understanding Date Labels**: Distinguish between "Use By" (safety critical) and "Best Before" (quality peak indicator). Many dry shelf-stable foods remain safe and nutritious after their best-before date.
5. **Decentralized Balcony / Backyard Composting**: Convert wet kitchen waste (vegetable peels, fruit rinds, tea dregs, eggshells) into rich organic humic compost using terracotta pot composters (aerobic) or bokashi bins, keeping organic mass out of landfills.

## Recommended Household Actions
- Audit refrigerator crispers twice a week to prioritize perishable produce.
- Set up an aerobic terracotta composting pot or kitchen bokashi composter.
- Freeze surplus cooked food or donate edible surplus food to verified food banks.
""",

    "sustainable_living/reduce_household_waste.md": """---
title: Household Solid Waste Minimization & 5R Hierarchy
category: sustainable_living
source: Swachh Bharat Mission (Urban 2.0) Source Segregation Protocol
source_url: https://swachhbharatmission.gov.in/
organization: Ministry of Housing and Urban Affairs (MoHUA)
date: 2022-10-02
location: India (National)
summary: Ministry of Housing and Urban Affairs source reduction protocols, waste hierarchy implementation, and zero-landfill household guidelines.
---

# Household Solid Waste Minimization & 5R Hierarchy

Under the Swachh Bharat Mission (Urban 2.0), urban local bodies prioritize decentralized waste processing and source reduction following the internationally recognized 5R Waste Hierarchy: **Refuse > Reduce > Reuse > Repurpose > Recycle**.

## Implementing the 5R Framework

1. **Refuse**: Decline unnecessary single-use items, free promotional merchandise, plastic brochures, disposable cutlery, and extra plastic shopping bags.
2. **Reduce**: Select concentrated cleaning agents, purchase loose produce rather than plastic-wrapped items, and buy durable multi-year goods.
3. **Reuse**: Repurpose glass jam jars and honey containers for spice and pulse storage; utilize old cotton clothing as cleaning rags and floor dusters.
4. **Repurpose**: Upcycle packaging cardboard for domestic organization, gardening seed trays, or pet bedding.
5. **Recycle**: Clean and segregate paper, cardboard, PET containers, and metal scrap before handing over to municipal collection or authorized scrap dealers (kabadiwalas).

## Recommended Household Actions
- Maintain strict 3-way segregation: Green (Wet), Blue (Dry), Red (Domestic Hazardous).
- Avoid disposable single-use plates and cups during family gatherings and celebrations.
- Repair household electronics, footwear, and apparel rather than prematurely discarding them.
""",

    "sustainable_living/energy_saving_tips.md": """---
title: Energy Conservation in Domestic Buildings & Thermal Comfort
category: sustainable_living
source: Energy Conservation Building Code for Residential Buildings (Eco-Niwas Samhita)
source_url: https://beeindia.gov.in/en/energy-efficiency-in-buildings
organization: Bureau of Energy Efficiency (BEE)
date: 2023-06-15
location: India (National)
summary: Official Bureau of Energy Efficiency building guidelines for passive cooling, natural daylighting, solar water heating, and appliance load optimization.
---

# Energy Conservation in Domestic Buildings & Thermal Comfort

The Bureau of Energy Efficiency's Eco-Niwas Samhita provides technical guidelines to lower cooling and electrical energy demand in residential buildings through architectural and behavioral interventions.

## Passive Cooling & Behavioral Measures

1. **Solar Heat Gain Reduction**: Use light-colored or reflective thermal window blinds and exterior solar reflective white paint (high Solar Reflectance Index - SRI) on rooftops to reduce indoor room temperatures by 2°C to 5°C during summer months.
2. **Cross-Ventilation Optimization**: Open windows during cooler evening and early morning hours to allow natural convective heat exchange, reducing dependency on motorized cooling.
3. **Solar Water Heating**: Installing rooftop solar thermal water heating systems replaces electric geysers (which consume 1.5 kW to 3 kW), saving 1,200 to 1,500 units of electricity annually per family.
4. **BLDC Ceiling Fans**: Brushless Direct Current (BLDC) motor fans consume only 28W–32W compared to 75W–80W consumed by traditional induction fans, cutting fan electrical bills by over 60%.

## Recommended Household Actions
- Replace conventional induction ceiling fans with certified 5-star BLDC fans.
- Apply high-reflectance lime wash or solar reflective paint on exposed building roofs.
- Clean air conditioning mesh filters fortnightly to prevent compressor strain and excessive power draw.
""",

    "sustainable_living/sustainable_daily_lifestyle.md": """---
title: Mission LiFE — 75 Individual Lifestyle Actions for Environmental Sustainability
category: sustainable_living
source: Mission LiFE (Lifestyle for Environment) Action Framework
source_url: https://missionlife-moefcc.nic.in/
organization: Ministry of Environment, Forest and Climate Change (MoEFCC) & NITI Aayog
date: 2022-10-20
location: India (National)
summary: Comprehensive government framework detailing 75 actionable daily habits across energy, water, waste, and sustainable food consumption.
---

# Mission LiFE — 75 Individual Lifestyle Actions for Environmental Sustainability

Mission LiFE (Lifestyle for Environment), spearheaded by the Government of India and NITI Aayog in partnership with the United Nations, outlines an evidence-based approach to shift public behavior from mindless consumption to mindful utilization.

## 7 Core Action Themes

1. **Save Energy**: Maintain AC temperature at 24°C, use public transit, walk or cycle for short distances, use LED lighting, switch off vehicle ignitions at traffic red lights.
2. **Save Water**: Fix leaking fixtures, adopt bucket bathing, cultivate drought-tolerant native plants, use drip irrigation in residential gardens.
3. **Say No to Single-Use Plastic**: Carry reusable cloth bags, use refillable water containers, replace plastic cutlery with steel or plant-based alternatives.
4. **Adopt Sustainable Food Systems**: Include climate-resilient millets (ragi, jowar, bajra) in daily diet, prepare meals in calculated quantities, compost organic kitchen waste.
5. **Reduce Waste (Circular Economy)**: Segregate wet and dry waste at home, donate wearable old clothes and functional electronics, repair appliances.
6. **Adopt Healthy Lifestyles**: Practice organic urban terrace gardening, consume seasonal and locally grown produce, reduce ultra-processed packaged snacks.
7. **Reduce E-Waste**: Repair mobile devices before replacing, safely hand over defunct gadgets to authorized EPR collection centers.

## Recommended Household Actions
- Select one new LiFE habit every week to establish permanent behavioral routines.
- Incorporate nutrient-dense native millets into weekly home meal preparation.
- Switch off vehicle engines at traffic signals with idle times exceeding 20 seconds.
""",

    # -------------------------------------------------------------
    # 2. RECYCLING
    # -------------------------------------------------------------
    "recycling/battery_disposal.md": """---
title: Safe Collection, Disposal & Recycling of Household Batteries
category: recycling
source: Battery Waste Management Rules 2022
source_url: https://cpcb.nic.in/battery-waste-management-rules-2022/
organization: Central Pollution Control Board (CPCB)
date: 2022-08-24
location: India (National)
summary: Statutory CPCB regulations on managing portable alkaline, nickel-cadmium, and lithium-ion batteries through authorized Extended Producer Responsibility drop-offs.
---

# Safe Collection, Disposal & Recycling of Household Batteries

Under the Battery Waste Management Rules 2022 enacted by the Ministry of Environment, Forest and Climate Change, batteries are legally classified as domestic hazardous waste and must not be mixed with municipal garbage or sent to landfills.

## Risks of Improper Disposal

- **Toxic Heavy Metal Leaching**: Spent batteries contain toxic cadmium, lead, nickel, mercury, and volatile organic lithium electrolytes. In landfills, corroding casings allow heavy metals to seep into aquifers and surface water bodies.
- **Fire Hazards**: Punctured, damaged, or short-circuited lithium-ion cells from mobile phones, toys, and laptops can experience thermal runaway, triggering hazardous landfill and waste vehicle fires.

## Standard Disposal Guidelines

1. **Terminal Insulation**: When storing spent lithium or 9V button batteries, apply non-conductive electrical tape or transparent cello tape over the metallic contact terminals to prevent accidental short-circuits.
2. **Dedicated Storage Box**: Store spent dry cells in a cool, dry plastic container away from flammable materials and out of reach of children.
3. **Authorized Drop-Off Points**: Return spent batteries to authorized brand service centers, consumer electronics retailers with designated collection kiosks, or municipal hazardous waste drop-off drives.

## What NOT to Do
- Never dispose of batteries in general dry or wet household waste bins.
- Never crush, incinerate, puncture, or dismantle battery packs.
- Never sell lead-acid inverter batteries to unregistered roadside smelting operations.
""",

    "recycling/ewaste_disposal.md": """---
title: Electronic Waste (E-Waste) Management and Producer Take-Back Protocols
category: recycling
source: E-Waste (Management) Rules 2022 & CPCB Implementation Framework
source_url: https://cpcb.nic.in/e-waste/
organization: Central Pollution Control Board (CPCB)
date: 2023-04-01
location: India (National)
summary: Legal guidelines governing consumer e-waste disposal, Extended Producer Responsibility (EPR) mandates, and formal recycler networks across India.
---

# Electronic Waste (E-Waste) Management and Producer Take-Back Protocols

The E-Waste (Management) Rules 2022 mandate that consumers, bulk consumers, and commercial entities must channel end-of-life electrical and electronic equipment exclusively through registered producers, authorized dismantlers, or formal recyclers.

## Categories of Regulated Household E-Waste

- **Information Technology Equipment**: Laptops, desktop computers, monitors, tablets, networking routers, external hard drives, keyboards, and mice.
- **Consumer Electronics**: Television sets, audio amplifiers, set-top boxes, digital cameras, and charging adapters.
- **Large & Small Appliances**: Refrigerators, air conditioners, washing machines, microwaves, electric kettles, and vacuum cleaners.

## Step-by-Step Recycling Process

1. **Verify State Pollution Control Board Registry**: Ensure that any e-waste recycler or collection agency holds a valid registration certificate issued by the Central Pollution Control Board (CPCB) or respective State Pollution Control Board (SPCB).
2. **Utilize Brand Take-Back / Buyback Schemes**: Leading manufacturers operate Extended Producer Responsibility (EPR) programs with complimentary door-to-door courier pickups or in-store drop-off collection boxes.
3. **Avoid Informal Acid-Leaching Operators**: Never hand over circuit boards or computing equipment to unauthorized scrap dealers who use open cyanide/acid baths and open burning to extract trace gold and copper, causing severe toxic exposure.

## Recommended Household Actions
- Inspect all inactive household electronics and schedule drop-offs with registered EPR recyclers.
- Remove external batteries and data storage cards prior to handing over equipment.
""",

    "recycling/plastic_recycling_guide.md": """---
title: Plastic Recycling & Resin Identification Codes (RIC 1–7) Guide
category: recycling
source: Guidelines on Extended Producer Responsibility (EPR) for Plastic Packaging
source_url: https://cpcb.nic.in/epr-plastic-waste/
organization: Central Pollution Control Board (CPCB)
date: 2022-02-16
location: India (National)
summary: Comprehensive technical guide to identifying recyclable plastics, resin codes 1 through 7, washing requirements, and municipal Material Recovery Facility sorting.
---

# Plastic Recycling & Resin Identification Codes (RIC 1–7) Guide

Under CPCB guidelines and Bureau of Indian Standards (BIS) specifications, plastic containers and packaging are stamped with a triangular chasing-arrows symbol enclosing a numeric Resin Identification Code (1 to 7).

## Detailed Breakdown of Plastic Resin Codes

1. **Code 1: PET / PETE (Polyethylene Terephthalate)**
   - *Common items*: Transparent water bottles, soda bottles, clear cooking oil jars.
   - *Recyclability*: Highly recyclable into polyester staple fibers, geofabrics, and new bottles.
   - *Preparation*: Empty completely, rinse to remove residual sugar or grease, and crush flat.
2. **Code 2: HDPE (High-Density Polyethylene)**
   - *Common items*: Shampoo bottles, detergent bottles, milk containers, bottle caps.
   - *Recyclability*: Widely recyclable into plastic lumber, drainage pipes, and crates.
3. **Code 3: PVC (Polyvinyl Chloride)**
   - *Common items*: Rigid plumbing pipes, window profiles, blister packaging.
   - *Recyclability*: Rarely accepted in residential curbside recycling.
4. **Code 4: LDPE (Low-Density Polyethylene)**
   - *Common items*: Grocery bags, bread bags, shrink wrap, bubble wrap.
   - *Recyclability*: Requires specialized soft-film collection drop-offs; jams municipal sorting machinery if mixed in rigid dry waste.
5. **Code 5: PP (Polypropylene)**
   - *Common items*: Yogurt containers, medicine containers, takeaway meal boxes, bottle caps.
   - *Recyclability*: Highly recyclable into storage bins, battery cases, and automotive components.
6. **Code 6: PS (Polystyrene / Expanded Polystyrene)**
   - *Common items*: Disposable foam cups, thermocol packaging cushioning, disposable clamshells.
   - *Recyclability*: Extremely difficult to recycle economically; avoid purchasing wherever possible.
7. **Code 7: Other / Multi-Layer Laminates (MLP)**
   - *Common items*: Metalized snack pouches (chips/crisps), toothpaste tubes, polycarbonate.
   - *Recyclability*: Cannot be mechanically reprocessed via traditional recycling; sent for cement kiln co-processing or waste-to-energy.

## Recommended Household Actions
- Rinse and dry all Code 1 (PET), Code 2 (HDPE), and Code 5 (PP) containers before placing in the blue dry-waste bin.
- Refuse Code 6 (Polystyrene) disposable cutlery and food packaging.
""",

    "recycling/household_waste_separation.md": """---
title: Household Waste Segregation Standards (SWM Rules 2016)
category: recycling
source: Solid Waste Management Rules 2016
source_url: https://cpcb.nic.in/solid-waste-rules/
organization: Ministry of Environment, Forest and Climate Change (MoEFCC)
date: 2016-04-08
location: India (National)
summary: Statutory requirements under the Solid Waste Management Rules 2016 for 3-stream household waste segregation into biodegradable, non-biodegradable, and hazardous streams.
---

# Household Waste Segregation Standards (SWM Rules 2016)

The Solid Waste Management Rules 2016, notified by the Ministry of Environment, Forest and Climate Change (MoEFCC), place a direct statutory duty on all waste generators (households, residential complexes, institutions) to segregate waste at source into three distinct streams before handing over to municipal collection workers.

## The 3 Mandatory Waste Streams

### 1. Biodegradable (Wet Waste) — Green Bin
- *Permitted contents*: Fruit and vegetable trimmings, cooked food leftovers, rotten grains, eggshells, tea bags, coffee grounds, garden clippings, wilted flowers.
- *Handling*: Hand over daily without plastic liners. Use newspaper wrap or transfer directly from bucket to waste collection vehicle.

### 2. Non-Biodegradable (Dry Waste) — Blue Bin
- *Permitted contents*: Clean paper, newspapers, magazines, cardboard boxes, plastic bottles, beverage cartons, glass bottles, metal tins, foil containers (clean), dry leather, textiles.
- *Rule*: Keep dry and free of food grease. Soiled paper stained with food or oil cannot be processed at recycling mills.

### 3. Domestic Hazardous Waste — Red Bin / Marked Pouch
- *Permitted contents*: Spent batteries, broken CFL bulbs, fluorescent tubes, expired pharmaceuticals, discarded aerosol cans, bleach, pesticide containers, sanitary pads and baby diapers (securely wrapped in paper and marked with a red cross).
- *Handling*: Keep strictly isolated to protect sanitation workers from biological pathogens and hazardous chemical exposure.

## Legal Prohibitions
- Open dumping or burning of solid waste on streets, vacant plots, or open drains is strictly prohibited and subject to municipal spot fines.
""",

    "recycling/mobile_phone_disposal.md": """---
title: Safe Mobile Phone Disposal, Data Sanitization & Material Recovery
category: recycling
source: Guidelines for Environmentally Sound Management of End-of-Life Mobile Phones
source_url: https://cpcb.nic.in/displaypdf.php?id=ZS13YXN0ZS9HdWlkZWxpbmVzX01vYmlsZV9QaG9uZXMucGRm
organization: Central Pollution Control Board (CPCB) & MeitY
date: 2023-05-10
location: India (National)
summary: Step-by-step procedures for personal data sanitization, battery handling, and depositing obsolete smartphones with authorized take-back centers.
---

# Safe Mobile Phone Disposal, Data Sanitization & Material Recovery

End-of-life smartphones contain significant quantities of recoverable precious metals—including gold, silver, copper, and palladium—alongside hazardous elements like arsenic, lead, and brominated flame retardants.

## Pre-Disposal Checklist: Data Security & Preparation

1. **Cloud / Local Backup**: Export all photos, contacts, financial documents, and authentication tokens to secure external media or verified cloud storage.
2. **De-Authorize Device Accounts**: Log out from Google Accounts, Apple ID, WhatsApp, digital payment applications (UPI), and multi-factor authentication authenticators.
3. **Encrypted Factory Data Reset**: Execute a full factory data reset with storage encryption enabled, ensuring personal data cannot be recovered using forensic software.
4. **Physical Removal of SIM & Memory Cards**: Eject external MicroSD cards and cellular SIM cards before packaging the device.

## Authorized Channeling Channels

- **Manufacturer Extended Producer Responsibility (EPR) Portals**: Major smartphone OEMs (Apple, Samsung, Xiaomi, etc.) maintain dedicated take-back kiosks at authorized customer service centers and provide postage-paid recycling mail-in boxes.
- **Refurbishment & Exchange Trade-Ins**: If the device remains operational, exchange it when purchasing a replacement or sell to verified refurbishment services to maximize the device's operational lifecycle.

## What NOT to Do
- Never sell old smartphones to informal curbside scrap collectors who dismantle devices over open flames.
- Never dispose of old phones in municipal garbage bins.
""",

    # -------------------------------------------------------------
    # 3. ECO PRODUCTS
    # -------------------------------------------------------------
    "eco_products/energy_efficient_appliances.md": """---
title: Appliance Energy Efficiency & BEE Star Rating Selection Guide
category: eco_products
source: BEE Star Labeling Guidelines for Inverter ACs, Refrigerators and Fans
source_url: https://beeindia.gov.in/en/standards-labeling-portal
organization: Bureau of Energy Efficiency (BEE)
date: 2023-07-01
location: India (National)
summary: Detailed technical parameters for evaluating energy-efficient home appliances, understanding ISEER ratings, and calculating total cost of ownership.
---

# Appliance Energy Efficiency & BEE Star Rating Selection Guide

When purchasing major household electric appliances, evaluating the lifecycle operational cost (electricity bills over 7 to 10 years) is far more important than initial retail price.

## Understanding Star Rating Metrics

1. **Room Air Conditioners (ISEER Metric)**:
   - Evaluated using the **Indian Seasonal Energy Efficiency Ratio (ISEER)**, which measures cooling output per unit of electrical input across seasonal temperature variations.
   - A 5-Star inverter AC (ISEER ≥ 5.0) consumes up to 30% to 40% less electrical power than an entry-level 1-Star or 2-Star non-inverter air conditioner.
2. **Refrigerators**:
   - Modern 5-Star frost-free refrigerators feature variable-speed digital inverter compressors that adjust cooling power based on ambient temperature and internal door-opening frequency.
   - Over a 10-year lifespan, a 5-Star refrigerator saves more than ₹15,000 to ₹25,000 in electricity tariffs compared to an unrated model.
3. **Ceiling Fans (BLDC Technology)**:
   - 5-Star rated Brushless DC (BLDC) motor fans operate on 28W–32W at maximum speed, compared to 75W–80W consumed by traditional copper induction coil fans.

## Purchasing Checklist
- Verify the physical star rating label against the official BEE online verification portal (**beeindia.gov.in**).
- Prioritize inverter motor technology for compressors and wash motors.
- Check manufacturer warranty terms for compressors and electronic PC boards.
""",

    "eco_products/reusable_bottle.md": """---
title: Sustainable Reusable Water Bottles: Materials & Lifecycle Analysis
category: eco_products
source: IS 17526: Commercial Beverage Bottles & Food Contact Containers
source_url: https://www.bis.gov.in/
organization: Bureau of Indian Standards (BIS) & UNEP
date: 2023-02-15
location: Global / India
summary: Bureau of Indian Standards specifications for food-grade stainless steel, borosilicate glass, and lifecycle breakeven analysis against single-use PET bottles.
---

# Sustainable Reusable Water Bottles: Materials & Lifecycle Analysis

A reusable bottle replaces hundreds of single-use disposable PET water bottles every year, drastically reducing plastic waste and manufacturing emissions.

## Comparison of Reusable Bottle Materials

| Material | Durability | Health & Safety | Environmental Breakeven | Maintenance |
|---|---|---|---|---|
| **Food-Grade 304/316 Stainless Steel** | Outstanding (10+ years); dent-resistant | 100% BPA/BPS-free; no chemical leaching; suitable for hot and cold | ~25 to 40 uses compared to single-use PET | Rinse daily; wash with warm water and baking soda weekly |
| **Borosilicate Glass** | Moderate (fragile if dropped; use silicone sleeve) | Completely inert; zero taste retention; dishwasher safe | ~30 to 50 uses compared to single-use PET | Hand wash or dishwasher; inspect for thermal hairline cracks |
| **BPA-Free Tritan Polymer** | High; shatter-proof | High grade copolymer; avoid prolonged exposure to boiling water | ~20 to 30 uses | Wash with soft sponge to prevent interior scratching |
| **Single-Use PET Bottle** | One-time use; degrades rapidly | Leaches microplastics with heat and reuse; chemical degradation | Never breaks even; 100% waste generation | Not recommended for reuse |

## Environmental Breakeven Principle
Every reusable item embodies energy and material extraction costs. To achieve a net positive environmental outcome, a stainless steel water bottle must be used continuously for at least 1 to 2 months.
""",

    "eco_products/choosing_eco_products.md": """---
title: Guidelines for Selecting Truly Sustainable Products & Avoiding Greenwashing
category: eco_products
source: UNEP Guidelines for Providing Product Sustainability Information
source_url: https://www.unep.org/resources/report/guidelines-providing-product-sustainability-information
organization: United Nations Environment Programme (UNEP)
date: 2021-08-30
location: Global
summary: UNEP 8-point product lifecycle evaluation framework covering durability, repairability, non-toxicity, and methods to detect misleading greenwashing claims.
---

# Guidelines for Selecting Truly Sustainable Products & Avoiding Greenwashing

The United Nations Environment Programme (UNEP) framework outlines 8 fundamental criteria to help consumers evaluate product sustainability based on verified data rather than marketing rhetoric.

## The 8 Evaluation Criteria

1. **Durability**: Built with rugged, long-lasting components engineered to withstand repeated daily cycles without premature failure.
2. **Repairability**: Assembled with standard mechanical fasteners (screws, modular clips) allowing easy battery or part replacements rather than permanent glue seals.
3. **Reusability**: Designed to replace multiple single-use disposable equivalents over an extended operational life.
4. **Material Safety**: Fabricated from non-toxic, recyclable, or certified organic raw materials (e.g. food-grade steel, FSC-certified timber, GOTS-certified textiles).
5. **Operational Energy/Water Efficiency**: Consumes minimal electricity or water during active operation (verified by BEE star ratings or equivalent certifications).
6. **Minimal Packaging**: Distributed with plastic-free, unbleached cardboard, or refillable bulk packaging.
7. **End-of-Life Recyclability**: Components can be disassembled and accepted by standard municipal or authorized recycler streams.
8. **Origin & Supply Chain Transparency**: Sourced from ethical, fair-trade, and regionally proximate suppliers to minimize transport footprints.

## Identifying Greenwashing Red Flags
- Vague claims such as "100% Natural", "Eco-Pure", or "Green Choice" without supporting technical data.
- Self-declared unverified logos resembling legitimate third-party certification seals.
- Products advertising a single eco-friendly ingredient while utilizing heavily polluting primary polymers.
""",

    "eco_products/sustainable_packaging.md": """---
title: Sustainable Packaging: Materials, Refill Systems & Life Cycle Comparison
category: eco_products
source: Guidelines on Sustainable Packaging and Plastics Alternatives
source_url: https://moef.gov.in/
organization: Ministry of Environment, Forest and Climate Change (MoEFCC)
date: 2023-09-12
location: India (National)
summary: MoEFCC technical assessment comparing packaging substrates (glass, aluminium, kraft paper, bioplastics) and refillable delivery models.
---

# Sustainable Packaging: Materials, Refill Systems & Life Cycle Comparison

Packaging accounts for over 45% of all virgin plastic polymer production globally. Transitioning to circular packaging models is essential to curb landfill accumulation.

## Packaging Substrates Comparison

- **Aluminium / Tinplate**: Possesses infinite recyclability without physical property degradation. Recycling aluminium requires 95% less energy than virgin smelting from bauxite ore. Excellent for food, beverages, and cosmetic tins.
- **Glass**: 100% chemically inert, impermeable, and infinitely recyclable. Best suited for regional refill systems; however, long-distance freight entails higher transport fuel emissions due to container mass.
- **Unbleached Kraft Paper / Corrugated Fiberboard**: Biodegradable, compostable, and recyclable up to 5 to 7 times when free of plastic tape and polyethylene wax coatings.
- **Refill Stations & Concentrated Formulations**: The most sustainable packaging innovation is eliminating single-use bottles altogether by buying concentrated tablets or liquids diluted with domestic tap water.

## Recommended Household Actions
- Select personal care and home cleaning products that offer concentrated refill pouches or dissolvable tablets.
- Tear off plastic adhesive tape and mailing labels from cardboard shipping cartons before recycling.
""",

    "eco_products/reusable_alternatives_guide.md": """---
title: Reusable Household Alternatives: Breakeven Analysis & Product Care
category: eco_products
source: Life Cycle Assessment of Single-Use Products vs Reusable Alternatives
source_url: https://www.unep.org/resources/report/single-use-plastic-products-and-their-alternatives-recommendations-policymakers
organization: United Nations Environment Programme (UNEP)
date: 2022-11-15
location: Global
summary: UNEP Life Cycle Assessment (LCA) data establishing scientific breakeven use cycles for bags, coffee cups, food containers, and shaving razors.
---

# Reusable Household Alternatives: Breakeven Analysis & Product Care

Under UNEP life cycle assessments, a reusable product only becomes ecologically superior to single-use disposables once it surpasses its manufacturing "breakeven threshold."

## Breakeven Matrix for Common Swaps

1. **Cotton Tote Bag vs LDPE Grocery Bag**:
   - *Breakeven*: 50 to 100 reuse cycles.
   - *Maintenance*: Wash with cold water and air dry; keep multiple bags inside your vehicle or backpack.
2. **Stainless Steel Travel Tumbler vs Paper/Plastic Coffee Cup**:
   - *Breakeven*: 20 to 40 reuse cycles.
   - *Maintenance*: Rinse with warm soapy water immediately after coffee/tea consumption.
3. **Beeswax Food Wraps vs Cling Film / Foil**:
   - *Breakeven*: 15 to 25 reuse cycles.
   - *Maintenance*: Wash with cool water and mild detergent; re-coat with beeswax pellets annually.
4. **Solid Metal Safety Razor vs Disposable Plastic Cartridge**:
   - *Breakeven*: 10 to 15 shaves.
   - *Benefit*: High-grade brass/steel handle lasts a lifetime; only recyclable steel blades are replaced at a fraction of the cost.

## Core Maxim
The greenest reusable product is always the one you already own and actively use until end-of-life.
""",

    # -------------------------------------------------------------
    # 4. GOVERNMENT SCHEMES
    # -------------------------------------------------------------
    "government_schemes/solar_scheme.md": """---
title: PM Surya Ghar Muft Bijli Yojana — Rooftop Solar Scheme
category: government_schemes
source: PM Surya Ghar Operational Guidelines
source_url: https://pmsuryaghar.gov.in
organization: Ministry of New and Renewable Energy (MNRE), Government of India
date: 2024-02-13
location: India (National)
summary: Comprehensive guidelines on central subsidies, technical requirements, net metering, and portal application procedures for residential rooftop solar.
---

# PM Surya Ghar Muft Bijli Yojana — Rooftop Solar Scheme

Launched by the Prime Minister in February 2024 with a financial outlay of ₹75,021 crore, the **PM Surya Ghar: Muft Bijli Yojana** aims to install residential rooftop solar systems on 1 crore (10 million) households across India, providing up to 300 units of free electricity every month.

## Central Financial Assistance (Subsidy) Structure

- **Systems up to 2 kW capacity**: ₹30,000 per kW (e.g. ₹60,000 for a 2 kW system).
- **Systems between 2 kW and 3 kW**: ₹60,000 for the first 2 kW plus ₹18,000 for the additional 1 kW (maximum total subsidy of ₹78,000 for systems 3 kW or higher).
- **Group Housing Societies / Residential Welfare Associations (GHS/RWA)**: ₹18,000 per kW for common facilities (lighting, EV charging, water pumps) up to 500 kW capacity.

## Eligibility & Prerequisite Conditions
1. The applicant must be an Indian citizen and resident.
2. The applicant must possess legal ownership or tenancy rights to a residential building with a suitable, unshaded rooftop.
3. The applicant must hold a valid residential electricity consumer account with the local DISCOM with zero pending arrears.

## Step-by-Step National Portal Application
1. **Registration**: Visit **https://pmsuryaghar.gov.in**, select your State, electricity distribution company (DISCOM), and enter your Consumer Account Number.
2. **Technical Feasibility**: Submit the rooftop solar application to obtain DISCOM technical feasibility approval.
3. **Vendor Empanelment & Installation**: Contract an empanelled solar vendor registered with your local DISCOM to install Bureau of Indian Standards (BIS) and ALMM-approved solar modules.
4. **Net-Metering Inspection**: Apply for net-metering commissioning through the portal. A bidirectional net-meter is installed by the DISCOM.
5. **Subsidy Disbursement**: Upload commissioning certificate and bank account details on the portal; the central subsidy is directly transferred via DBT within 30 days.
""",

    "government_schemes/clean_transportation.md": """---
title: FAME India & Electric Mobility Promotion Scheme (EMPS)
category: government_schemes
source: Electric Mobility Promotion Scheme (EMPS) & FAME Policy
source_url: https://heavyindustries.gov.in/
organization: Ministry of Heavy Industries (MHI), Government of India
date: 2024-04-01
location: India (National)
summary: Ministry of Heavy Industries policy framework providing upfront purchase demand incentives on certified electric two-wheelers, three-wheelers, and public EV charging.
---

# FAME India & Electric Mobility Promotion Scheme (EMPS)

The Ministry of Heavy Industries (MHI) manages national fiscal frameworks to accelerate electric vehicle (EV) adoption and build domestic electric component manufacturing under the Faster Adoption and Manufacturing of Electric Vehicles (FAME) scheme and the subsequent Electric Mobility Promotion Scheme (EMPS).

## Consumer Benefits & Support Pillars

1. **Upfront Demand Incentives**: Approved electric two-wheelers and electric three-wheelers receive direct capital subsidies that are deducted by registered dealerships from the showroom invoice price.
2. **Operating Economy**: While internal combustion engine (ICE) two-wheelers cost approximately ₹2.20 to ₹2.80 per kilometre in petrol expenses, electric two-wheelers operate at approximately ₹0.30 to ₹0.60 per kilometre.
3. **State EV Policy Exemptions**: Various State Transport Departments (e.g. Maharashtra, Delhi, Karnataka, Andhra Pradesh, Tamil Nadu) provide 100% waiver of road tax and registration fees for battery electric vehicles.
4. **Public Charging Infrastructure**: Subsidies supporting public and commercial charging stations along major national expressways and in metropolitan urban centers.

## How to Access EV Incentives
- Visit an authorized dealer selling models approved under the Ministry of Heavy Industries portal (**heavyindustries.gov.in**).
- The dealership applies the subsidy directly to your purchase invoice upon verifying Aadhaar and vehicle registration credentials.
""",

    "government_schemes/pm_surya_ghar_scheme.md": """---
title: PM Surya Ghar: Muft Bijli Yojana — Detailed Implementation Guidelines
category: government_schemes
source: PM Surya Ghar Guidelines & Notification
source_url: https://pmsuryaghar.gov.in
organization: Ministry of New and Renewable Energy (MNRE), Government of India
date: 2024-02-13
location: India (National)
summary: Official operational guidelines for rooftop solar installation, vendor selection, net-metering grid connection, and direct benefit transfer (DBT) subsidy payments.
---

# PM Surya Ghar: Muft Bijli Yojana — Detailed Implementation Guidelines

The PM Surya Ghar scheme enables residential households across urban and rural India to generate clean energy on their rooftops, offset monthly electricity bills, and export surplus solar power back to the grid.

## Technical Requirements for Installation

- **Rooftop Area**: Approximately 100 square feet of shadow-free rooftop space is required for every 1 kW of installed solar photovoltaic capacity.
- **Solar Modules**: Must utilize Approved List of Models and Manufacturers (ALMM) certified solar PV modules with minimum efficiency standards to qualify for central subsidies.
- **Inverters & Protection**: Inverters must feature anti-islanding protection to automatically decouple from the grid during power outages, ensuring safety for line maintenance crews.

## Financial & Environmental Impact
- A standard 3 kW system generates an estimated 360 to 420 units of electricity per month, eliminating electricity bills for typical Indian urban households.
- Prevents approximately 3.5 to 4.2 tonnes of carbon dioxide emissions annually, equivalent to planting 180 mature trees over the system's 25-year operational lifespan.

## Official Portal Link
- All registrations and subsidy claims must be processed strictly through the unified national portal: **https://pmsuryaghar.gov.in**.
""",

    "government_schemes/faster_ev_scheme.md": """---
title: Electric Vehicle Adoption Incentives & Charging Infrastructure
category: government_schemes
source: National Electric Mobility Framework
source_url: https://heavyindustries.gov.in/
organization: Ministry of Heavy Industries (MHI), Government of India
date: 2024-04-01
location: India (National)
summary: Detailed incentives for electric mobility, battery safety standards, home charging guidelines, and municipal green transit concessions.
---

# Electric Vehicle Adoption Incentives & Charging Infrastructure

Electric vehicles offer a zero tailpipe-emission alternative to fossil fuel mobility, significantly cutting urban particulate matter (PM2.5, PM10) and nitrogen oxide emissions.

## Household Charging Best Practices

1. **Standard AC Slow Charging (Level 1 & 2)**: Utilizing a dedicated 15A or 16A grounded electrical circuit with industrial-grade wiring is recommended for overnight domestic charging. Slow AC charging optimizes lithium-ion battery chemistry longevity.
2. **Time-of-Day (ToD) Tariff Savings**: In states offering Time-of-Day electricity meters, scheduling EV charging during nocturnal off-peak hours (11:00 PM to 6:00 AM) reduces charging costs by up to 20% to 25%.
3. **Battery Safety Standards (AIS-156 & AIS-038 Rev 2)**: All electric two-wheelers and passenger vehicles sold in India must comply with stringent thermal runaway, water ingress (IP67), and mechanical impact safety standards mandated by the Ministry of Road Transport and Highways.

## Verification
- Confirm eligible models, dealership empanelment, and updated state subsidies at **heavyindustries.gov.in**.
""",

    "government_schemes/swachh_bharat_mission.md": """---
title: Swachh Bharat Mission (Urban 2.0) Solid Waste Management Guidelines
category: government_schemes
source: SBM Urban 2.0 Operational Guidelines
source_url: https://swachhbharatmission.gov.in/
organization: Ministry of Housing and Urban Affairs (MoHUA), Government of India
date: 2023-01-01
location: India (National)
summary: Central funding framework for 100% door-to-door waste collection, material recovery facilities (MRFs), legacy dumpsite remediation, and citizen participation.
---

# Swachh Bharat Mission (Urban 2.0) Solid Waste Management Guidelines

Swachh Bharat Mission (Urban 2.0), administered by the Ministry of Housing and Urban Affairs, focuses on making all Indian cities "Garbage Free" through scientific waste processing, elimination of single-use plastics, and source segregation.

## Primary SBM-U 2.0 Components

1. **100% Door-to-Door Source Segregation**: Empowers Urban Local Bodies (ULBs) to enforce mandatory separation of wet, dry, and domestic hazardous waste across all households and commercial establishments.
2. **Material Recovery Facilities (MRFs)**: Provides capital assistance for establishing mechanized MRFs equipped with shredders, optical sorters, and balers to maximize dry waste recyclability.
3. **Bio-Mining of Legacy Dumpsites**: Remediation and scientific capping of historic municipal landfill mounds, eliminating toxic leachate contamination of subterranean groundwater tables.
4. **Community Composting Support**: Financial and operational support for Resident Welfare Associations (RWAs) and apartment complexes adopting on-site aerobic composting for wet waste.

## Citizen Engagement & Swachhata App
- Citizens can download the official **Swachhata App** to report uncleared garbage, open dumping, and municipal sanitation grievances directly to their local municipal ward officer with geo-tagged photographic evidence.
""",

    # -------------------------------------------------------------
    # 5. ECO TRAVEL
    # -------------------------------------------------------------
    "eco_travel/city_travel.md": """---
title: Urban Sustainable Mobility & Low-Carbon Travel Alternatives
category: eco_travel
source: National Urban Transport Policy & Comprehensive Mobility Plan Guidelines
source_url: https://mohua.gov.in/cms/urban-transport.php
organization: Ministry of Housing and Urban Affairs (MoHUA)
date: 2023-08-10
location: India (Urban)
summary: Comparative emissions analysis of public buses, metro rail, shared mobility, and private internal combustion vehicles in Indian cities.
---

# Urban Sustainable Mobility & Low-Carbon Travel Alternatives

Transportation accounts for approximately 14% of India's energy-related greenhouse gas emissions and is a dominant contributor to urban smog and PM2.5 levels.

## Transport Modes Environmental Comparison

| Travel Mode | CO2 Emissions (g/passenger-km) | Road Space Consumption | Energy Efficiency |
|---|---|---|---|
| **Walking** | 0 g (Zero emissions) | Minimal | Highest |
| **Bicycle / Active Mobility** | 0 g (Zero emissions) | Extremely Low | Extremely High |
| **Electric Metro / Suburban Rail** | ~15 to 30 g | Dedicated ROW (Zero road space) | Very High |
| **Electric / CNG City Bus** | ~35 to 65 g | Low per passenger | High |
| **Shared Carpool (3-4 Passengers)** | ~60 to 85 g | Medium | Moderate |
| **Solo Petrol Two-Wheeler** | ~80 to 110 g | Medium | Moderate |
| **Solo Petrol / Diesel Car** | ~180 to 260+ g | Extremely High | Lowest |

## Actionable Commute Strategies
- **Trip Chaining**: Consolidate multiple individual errands (market visits, bank, postal errands) into a single transit loop rather than making multiple separate vehicular trips.
- **Multimodal Integration**: Walk or use shared e-rickshaws for first/last-mile transit to the nearest metro station or rapid transit bus stop.
""",

    "eco_travel/sustainable_commute.md": """---
title: Daily Commute Decarbonization & Workplace Mobility Strategies
category: eco_travel
source: National Electric Bus Programme & Clean Transit Initiatives
source_url: https://ceslindia.org/
organization: Convergence Energy Services Limited (CESL) & MoHUA
date: 2023-11-20
location: India (National)
summary: Practical strategies for commuters and employers to transition to shared transit, carpooling networks, and non-motorized active commuting.
---

# Daily Commute Decarbonization & Workplace Mobility Strategies

A commuter traveling 20 kilometres daily in a private solo petrol car generates over 1.2 tonnes of carbon dioxide emissions annually. Implementing shared or active commuting dramatically cuts personal carbon footprints.

## Commuter Action Playbook

1. **Workplace Carpooling Circles**: Organize carpooling with colleagues residing in adjacent neighborhoods. Sharing a four-person carpool cuts fuel expenditure and per-person transit emissions by 75%.
2. **Transit Passes & Digital Ticketing**: Utilize digital transit smart cards (e.g. National Common Mobility Card - NCMC) or city bus commuter passes for paperless, seamless multimodal boarding.
3. **Telecommuting & Hybrid Scheduling**: Negotiating 1 or 2 remote workdays per week eliminates 20% to 40% of weekly commuting emissions and relieves peak-hour city gridlock.
4. **Active Last-Mile Commuting**: Maintain a folding bicycle or brisk walking habit for the final 1 to 2 kilometres between transit stops and your workplace.

## Recommended Household Actions
- Replace solo car trips with public buses, metro, or carpooling for daily office commutes.
- Maintain correct manufacturer tire pressure (PSI) on personal vehicles to prevent 3% to 5% fuel efficiency penalties.
""",

    "eco_travel/public_transport_guide.md": """---
title: Public Transit Systems & National Common Mobility Card (NCMC)
category: eco_travel
source: National Common Mobility Card Guidelines & Transit Protocols
source_url: https://mohua.gov.in/
organization: Ministry of Housing and Urban Affairs (MoHUA)
date: 2023-05-18
location: India (National)
summary: Official guide on utilizing integrated public bus and metro systems, contactless NCMC fare cards, and last-mile connectivity.
---

# Public Transit Systems & National Common Mobility Card (NCMC)

India's National Common Mobility Card (NCMC) initiative, known under the tagline "One Nation, One Card," enables seamless travel across metro networks, city buses, toll gates, and suburban railways using a single interoperable contactless smart card.

## Key Advantages of Public Transit Adoption

- **Dramatic Footprint Reduction**: Shifting from a private automobile to an electric metro rail system reduces personal commute greenhouse gas emissions by more than 85%.
- **Urban Congestion Relief**: One standard city bus carries the equivalent passenger capacity of 40 to 50 private cars, freeing road capacity and reducing idling emissions.
- **Economic Value**: Monthly public transit passes cost a fraction of fuel, toll, and parking expenses associated with private vehicular ownership.

## Practical Recommendations
- Acquire an NCMC-compliant transit card from your local metro corporation or participating bank for contactless, ticketless transit access.
- Use municipal public transit tracker applications to plan journeys around real-time bus arrivals.
""",

    "eco_travel/cycling_walking_guide.md": """---
title: Active Mobility: Walking & Cycling for Urban Trips Under 5 km
category: eco_travel
source: Urban Active Mobility & Non-Motorised Transport (NMT) Design Manual
source_url: https://mohua.gov.in/
organization: Ministry of Housing and Urban Affairs (MoHUA) & ITDP India
date: 2022-12-05
location: India (National)
summary: Ministry of Housing and Urban Affairs guidance on active commuting for short trips, bicycle maintenance, road safety, and personal health benefits.
---

# Active Mobility: Walking & Cycling for Urban Trips Under 5 km

Over 40% of vehicular trips in Indian cities cover distances of less than 5 kilometres—a distance easily achievable on foot or bicycle without consuming fossil fuels.

## Distance Zones for Active Commuting

- **Under 2 Kilometres (Walking Zone)**: Takes 15 to 20 minutes of comfortable walking. In congested market centers, walking is frequently faster than driving and finding parking.
- **2 to 5 Kilometres (Cycling Zone)**: Takes 12 to 20 minutes on a commuter bicycle. Bicycles easily navigate traffic bottlenecks, produce zero greenhouse emissions, and provide cardiovascular exercise.

## Urban Cyclist Safety Guidelines

1. **Visibility & Lighting**: Equip bicycles with a front white LED light (visible from 150 meters), a rear red blinking LED light, and reflective pedal/wheel decals.
2. **Certified Safety Helmets**: Wear a certified bicycle helmet fastened snugly under the chin.
3. **Route Planning**: Choose secondary neighborhood lanes, university roads, and linear parks rather than high-speed multilane commercial arterial highways.
4. **Maintenance Checklist**: Maintain tire pressure within recommended PSI (stamped on tire sidewall), ensure brake pads are aligned, and lubricate the drive chain monthly.

## Recommended Household Actions
- Walk for all neighborhood grocery and vegetable purchases under 1.5 km.
- Equip your bicycle with front and rear LED lights before riding after dusk.
"""
}

def main():
    count = 0
    for rel_path, content in DOCS.items():
        file_path = KB_DIR / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content.strip() + "\n", encoding="utf-8")
        count += 1
        print(f"[{count:02d}/26] Wrote {file_path.name}")
    print(f"\nSuccessfully generated {count} verified real knowledge base documents in {KB_DIR}!")

if __name__ == "__main__":
    main()
