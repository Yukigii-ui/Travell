import Anthropic from 'npm:@anthropic-ai/sdk@0.27.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert travel planner AI. You create detailed, accurate, and highly personalized travel guides.

CRITICAL RULES:
1. Respond with ONLY valid JSON — no markdown, no explanation, no code blocks, just the raw JSON object
2. All lat/lng values must be real, accurate coordinates for the actual location
3. All prices must be realistic in USD
4. Activities should be geographically grouped by area to minimize travel time
5. Budget recommendations must genuinely fit the budget level
6. Include at least 14 food items, 6 hotels, 6 sports/activities, and 30 phrases across all categories
7. Phrase categories must include: greeting, direction, food, emergency, transport, shopping

The JSON must have exactly these top-level keys:
overview, itinerary, cities, food, hotels, sports, crowd_info, phrases, budget, practical, weather_heads_up, destination_highlights`;

const JSON_SCHEMA = `{
  "overview": { "description": "str", "best_time": "str", "currency": "str", "currency_code": "str", "language": "str", "safety_level": "very_safe|safe|moderate|caution", "timezone": "str", "capital": "str" },
  "itinerary": [{ "day": 1, "title": "str", "area": "str", "total_cost_usd": 0, "activities": [{ "time": "09:00", "activity": "str", "location": "str", "lat": 0.0, "lng": 0.0, "cost_usd": 0, "notes": "str", "indoor": false, "category": "attraction|food|transport|hotel|nightlife|nature|sport" }] }],
  "cities": [{ "name": "str", "description": "str", "highlights": ["str"], "best_for": "str", "crowd_level": "low|medium|high", "lat": 0.0, "lng": 0.0, "days_recommended": 2 }],
  "food": [{ "name": "str", "type": "dish|restaurant|street_food|cafe|market", "description": "str", "price_range": "str", "must_try": true, "dietary_tags": ["str"], "where_to_find": "str" }],
  "hotels": [{ "name": "str", "location": "str", "area": "str", "price_per_night_usd": 0, "rating": 4.2, "description": "str", "amenities": ["str"], "best_for": "str", "booking_tip": "str" }],
  "sports": [{ "name": "str", "category": "water|land|air|spectator|fitness|team", "description": "str", "location": "str", "best_season": "str", "cost_usd": 0, "difficulty": "easy|moderate|hard", "booking_required": false }],
  "crowd_info": { "overview": "str", "peak_months": ["str"], "off_peak_months": ["str"], "shoulder_months": ["str"], "tips": ["str"], "current_crowd_estimate": "low|medium|high" },
  "phrases": [{ "english": "str", "local": "str", "pronunciation": "str", "category": "greeting|direction|food|emergency|transport|shopping" }],
  "budget": { "total_estimated_usd": 0, "accommodation_per_night": 0, "food_per_day": 0, "transport_per_day": 0, "activities_per_day": 0, "tips_and_misc_per_day": 0, "budget_tips": ["str"] },
  "practical": { "transport": "str", "visa_info": "str", "emergency_numbers": "str", "tipping_culture": "str", "sim_card": "str", "currency_tips": "str", "health_tips": "str", "airport_transfer": "str" },
  "weather_heads_up": { "general": "str", "warnings": ["str"], "best_clothing": ["str"] },
  "destination_highlights": ["str"]
}`;

const BUDGET_DESCS: Record<string, string> = {
  budget: 'hostels, street food, public transport, free attractions — under $60/day total',
  mid: 'mid-range hotels, local restaurants, mix of transport — $60–180/day total',
  luxury: 'luxury hotels, fine dining, private transfers, premium experiences — $180+/day',
};

const PACE_DESCS: Record<string, string> = {
  relaxed: 'maximum 2–3 activities per day, plenty of rest, slow exploration',
  moderate: '3–4 activities per day, balanced between sightseeing and relaxation',
  packed: '5+ activities per day, maximise every hour, energetic schedule',
};

const PROFILE_DESCS: Record<string, string> = {
  backpacker: 'budget-conscious, social hostels, off-beaten-path, local experiences',
  luxury: 'premium everything, exclusive access, 5-star comfort',
  couple: 'romantic experiences, intimate restaurants, sunset spots, couples activities',
  family: 'child-friendly activities, family rooms, safety-focused, educational stops',
  solo: 'safe solo-friendly areas, social spots, flexible schedule, self-guided tours',
  digital_nomad: 'co-working spaces, reliable wifi cafés, monthly accommodation options',
  hidden_gems: 'avoid tourist traps, local secrets, off-the-beaten-path neighborhoods',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { destination, travel_dates, preferences } = await req.json();
    const { budget, pace, style, profile, interests, duration_days } = preferences;
    const { start, end } = travel_dates;

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: `Return JSON matching exactly this schema:\n${JSON_SCHEMA}`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Generate a complete travel guide for ${destination} for ${duration_days} days (${start} to ${end}).

Traveler preferences:
- Budget level: ${budget} — ${BUDGET_DESCS[budget] ?? budget}
- Pace: ${pace} — ${PACE_DESCS[pace] ?? pace}
- Travel style: ${style}
- Traveler profile: ${profile} — ${PROFILE_DESCS[profile] ?? profile}
- Interests: ${(interests as string[]).join(', ')}

Build the itinerary with ${duration_days} days. Group activities by area each day. Return only the JSON.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleanText = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const plan = JSON.parse(cleanText);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
