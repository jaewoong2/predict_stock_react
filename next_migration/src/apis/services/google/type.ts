// CreateEventDto.ts
export interface CreateEventRequest {
  summary?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

// CreateEventResponseDto.ts
export interface CreateEventResponse {
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}
