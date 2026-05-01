import Anthropic from 'npm:@anthropic-ai/sdk@0.27.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INSTRUCTIONS: Record<string, string> = {
  rain_day: 'Replace all outdoor activities with indoor alternatives (museums, cooking classes, spas, indoor markets, galleries). Keep the same area and similar time slots.',
  slow_down: 'Reduce the number of activities by 40%. Keep only the top highlights. Add more free time and leisurely meals.',
  more_nightlife: 'Replace evening activities (after 18:00) with nightlife options: rooftop bars, night markets, clubs, live music venues, night tours.',
  reschedule: 'Reorganize the itinerary to account for a late start (activities begin after 14:00). Compress activities smartly.',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { instruction, target_day, custom_instruction, existing_plan } = await req.json();

    const instructionText = instruction === 'custom'
      ? custom_instruction
      : INSTRUCTIONS[instruction] ?? 'Improve the itinerary based on common traveler feedback.';

    const scope = target_day
      ? `Modify only Day ${target_day} of the itinerary.`
      : 'Modify the full itinerary.';

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: `You are a travel planner. Modify this travel plan based on the instruction below.
${scope}
Instruction: ${instructionText}

Return ONLY the complete modified travel plan as valid JSON with the same structure as the input. No explanation.

Existing plan:
${JSON.stringify(existing_plan)}`,
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const updated = JSON.parse(clean);

    return new Response(JSON.stringify(updated), {
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
