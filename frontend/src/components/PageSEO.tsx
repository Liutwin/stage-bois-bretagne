import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.stageboisbretagne.com';

interface Props {
  title: string;
  description: string;
  path?: string;
}

export function PageSEO({ title, description, path = '' }: Props) {
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
