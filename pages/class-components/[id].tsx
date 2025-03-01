import React from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/Card';

const CardPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Card id={id as string} />;
};

export default CardPage;
