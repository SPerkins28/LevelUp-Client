export default interface APIResponse {
    id: number;
    slug: string;
    name: string;
    name_original: string;
    description: string;
    metacritic: number;
    metacritic_platforms: Metacriticplatform[];
    released: string;
    tba: boolean;
    updated: string;
    background_image: string;
    background_image_additional: string;
    website: string;
    rating: number;
    rating_top: number;
    ratings: Rating[];
    reactions: Reactions;
    added: number;
    added_by_status: Addedbystatus;
    playtime: number;
    screenshots_count: number;
    movies_count: number;
    creators_count: number;
    achievements_count: number;
    parent_achievements_count: number;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    reddit_logo: string;
    reddit_count: number;
    twitch_count: number;
    youtube_count: number;
    reviews_text_count: number;
    ratings_count: number;
    suggestions_count: number;
    alternative_names: string[];
    metacritic_url: string;
    parents_count: number;
    additions_count: number;
    game_series_count: number;
    user_game?: any;
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    parent_platforms: Parentplatform[];
    platforms: Platform4[];
    stores: Store2[];
    developers: Developer[];
    genres: Developer[];
    tags: Tag[];
    publishers: Developer[];
    esrb_rating: Platform2;
    clip?: any;
    description_raw: string;
  }
  
  interface Tag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
  }
  
  interface Developer {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }
  
  interface Store2 {
    id: number;
    url: string;
    store: Store;
  }
  
  interface Store {
    id: number;
    name: string;
    slug: string;
    domain: string;
    games_count: number;
    image_background: string;
  }
  
  interface Platform4 {
    platform: Platform3;
    released_at: string;
    requirements?: any;
  }
  
  interface Platform3 {
    id: number;
    name: string;
    slug: string;
    image?: any;
    year_end?: any;
    year_start?: any;
    games_count: number;
    image_background: string;
  }
  
  interface Parentplatform {
    platform: Platform2;
  }
  
  interface Platform2 {
    id: number;
    name: string;
    slug: string;
  }
  
  interface Addedbystatus {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
  }
  
  interface Reactions {
    '1': number;
    '3': number;
    '5': number;
    '9': number;
    '10': number;
    '11': number;
    '12': number;
    '13': number;
    '14': number;
    '15': number;
    '16': number;
    '19': number;
    '20': number;
  }
  
  interface Rating {
    id: number;
    title: string;
    count: number;
    percent: number;
  }
  
  interface Metacriticplatform {
    metascore: number;
    url: string;
    platform: Platform;
  }
  
  interface Platform {
    platform: number;
    name: string;
    slug: string;
  }