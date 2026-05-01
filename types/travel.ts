export type Budget = 'budget' | 'mid' | 'luxury';
export type Pace = 'relaxed' | 'moderate' | 'packed';
export type TravelStyle = 'adventure' | 'cultural' | 'family' | 'romantic' | 'nightlife' | 'food' | 'nature';
export type TravelerProfile =
  | 'backpacker'
  | 'luxury'
  | 'couple'
  | 'family'
  | 'solo'
  | 'digital_nomad'
  | 'hidden_gems';

export interface TravelPreferences {
  budget: Budget;
  pace: Pace;
  style: TravelStyle;
  profile: TravelerProfile;
  interests: string[];
  duration_days: number;
}

export interface Activity {
  time: string;
  activity: string;
  location: string;
  lat: number;
  lng: number;
  cost_usd: number;
  notes: string;
  indoor: boolean;
  category: 'attraction' | 'food' | 'transport' | 'hotel' | 'nightlife' | 'nature' | 'sport';
}

export interface ItineraryDay {
  day: number;
  title: string;
  area: string;
  total_cost_usd: number;
  activities: Activity[];
}

export interface City {
  name: string;
  description: string;
  highlights: string[];
  best_for: string;
  crowd_level: 'low' | 'medium' | 'high';
  lat: number;
  lng: number;
  days_recommended: number;
}

export interface Hotel {
  name: string;
  location: string;
  area: string;
  price_per_night_usd: number;
  rating: number;
  description: string;
  amenities: string[];
  best_for: string;
  booking_tip: string;
}

export interface Food {
  name: string;
  type: 'dish' | 'restaurant' | 'street_food' | 'cafe' | 'market';
  description: string;
  price_range: string;
  must_try: boolean;
  dietary_tags: string[];
  where_to_find: string;
}

export interface Sport {
  name: string;
  category: 'water' | 'land' | 'air' | 'spectator' | 'fitness' | 'team';
  description: string;
  location: string;
  best_season: string;
  cost_usd: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  booking_required: boolean;
}

export interface Phrase {
  english: string;
  local: string;
  pronunciation: string;
  category: 'greeting' | 'direction' | 'food' | 'emergency' | 'transport' | 'shopping';
}

export interface BudgetBreakdown {
  total_estimated_usd: number;
  accommodation_per_night: number;
  food_per_day: number;
  transport_per_day: number;
  activities_per_day: number;
  tips_and_misc_per_day: number;
  budget_tips: string[];
}

export interface TravelPlan {
  overview: {
    description: string;
    best_time: string;
    currency: string;
    currency_code: string;
    language: string;
    safety_level: 'very_safe' | 'safe' | 'moderate' | 'caution';
    timezone: string;
    capital: string;
  };
  itinerary: ItineraryDay[];
  cities: City[];
  food: Food[];
  hotels: Hotel[];
  sports: Sport[];
  crowd_info: {
    overview: string;
    peak_months: string[];
    off_peak_months: string[];
    shoulder_months: string[];
    tips: string[];
    current_crowd_estimate: 'low' | 'medium' | 'high';
  };
  phrases: Phrase[];
  budget: BudgetBreakdown;
  practical: {
    transport: string;
    visa_info: string;
    emergency_numbers: string;
    tipping_culture: string;
    sim_card: string;
    currency_tips: string;
    health_tips: string;
    airport_transfer: string;
  };
  weather_heads_up: {
    general: string;
    warnings: string[];
    best_clothing: string[];
  };
  destination_highlights: string[];
}

export interface SavedItinerary {
  id: string;
  user_id: string;
  destination: string;
  country_code?: string;
  travel_dates: {
    start: string;
    end: string;
    duration_days: number;
  };
  preferences: TravelPreferences;
  itinerary_data: TravelPlan;
  public_token: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateRequest {
  destination: string;
  travel_dates: { start: string; end: string; duration_days: number };
  preferences: TravelPreferences;
}

export interface RebuildRequest {
  itinerary_id: string;
  instruction: 'rain_day' | 'slow_down' | 'more_nightlife' | 'reschedule' | 'custom';
  target_day?: number;
  custom_instruction?: string;
  existing_plan: TravelPlan;
}
