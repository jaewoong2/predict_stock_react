export type OpenAiFindResponseRequest = {
  imageUrl?: string;
};

export type OpenAiFindResponseResponse = {
  contents: {
    title: string;
    habits: {
      name: string;
      checked: boolean;
    }[];
    date: string;
  };
};

export type OpenAiImageToTextRequest = {
  imageUrl?: string;
};

export type OpenAiImageToTextResponse = {
  content: {
    title: string;
    date: string;
    persentage: string;
  };
};
