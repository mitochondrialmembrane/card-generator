const BASE_URL = 'https://www.qbreader.org/api';

export interface QueryParams {
  queryString?: string;
  questionType?: 'tossup' | 'bonus' | 'all';
  searchType?: 'question' | 'answer' | 'all';
  caseSensitive?: boolean;
  exactPhrase?: boolean;
  difficulties?: string[] | string[];
  categories?: string[];
  subcategories?: string[];
  alternateSubcategories?: string[];
  maxReturnLength?: string;
}

export const queryDatabase = async (params: QueryParams = {}) => {
  const searchParams = new URLSearchParams({
    queryString: params.queryString || '',
    questionType: params.questionType || 'all',
    searchType: params.searchType || 'all',
    caseSensitive: params.caseSensitive ? 'true' : 'false',
    exactPhrase: params.exactPhrase ? 'true' : 'false',
    maxReturnLength: params.maxReturnLength || '25'
  });

  if (params.difficulties !== undefined) {
    searchParams.append('difficulties', params.difficulties.join(','))
  }
  if (params.categories !== undefined) {
    searchParams.append('categories', params.categories.join(','))
  }
  if (params.subcategories !== undefined) {
    searchParams.append('subcategories', params.subcategories.join(','))
  }
  if (params.alternateSubcategories !== undefined) {
    searchParams.append('alternateSubcategories', params.alternateSubcategories.join(','))
  }
  const queryString = searchParams.toString();

  const url = `${BASE_URL}/query?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json(); // Assuming the API returns JSON
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
