import { generatePath } from 'react-router-dom';

export type GenerateFullPathParamsType = {
  routeData: {
    scheme: string;
    placeholders?: Record<string, string | undefined | null>;
    search?: Record<string, string | undefined | null>;
    hash?: string | Record<string, string | undefined | null>;
  };
  preserveSearch?: boolean;
  preserveHash?: boolean;
}

export function generateFullPath(params: GenerateFullPathParamsType) {
  const routeData = params.routeData;

  let path = generatePath(routeData.scheme, routeData.placeholders);

  const searchParams = new URLSearchParams(params.preserveSearch ? window.location.search : '');
  if (routeData.search) {
    for (const searchKey in routeData.search) {
      const value = routeData.search[searchKey];
      typeof value === 'string' && value && searchParams.set(searchKey, value);
    }

    if (searchParams.size) path += `?${searchParams.toString()}`;
  }

  if (typeof routeData.hash === 'string') {
    path += `#${routeData.hash}`;
  } else if (routeData.hash) {
    const hashParams = new URLSearchParams(params.preserveHash ? window.location.hash.slice(1) : '');

    for (const hashKey in routeData.hash) {
      const value = routeData.hash[hashKey];
      typeof value === 'string' && value && hashParams.set(hashKey, value);
    }

    if (hashParams.size) path += `#${hashParams.toString()}`;
  }

  return path;
}
