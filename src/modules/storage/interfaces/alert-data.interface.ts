export interface AlertData {
    uuid?: string;
    country?: string;
    nThumbsUp?: number;
    reportBy?: string;
    reportByMunicipalityUser?: boolean;
    type?: string;
    subtype?: string;
    roadType?: number;
    location?: {
      x?: number;
      y?: number;
    };
    street?: string;
    fromNodeId?: number;
    toNodeId?: number;
    speed?: number;
    pubMillis?: number;
  }