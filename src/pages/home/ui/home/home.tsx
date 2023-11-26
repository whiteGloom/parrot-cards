import React, {FC} from 'react';
import {CardsList} from '../../../../features/listCards';
import {Link} from 'react-router-dom';

export const Home: FC = () => {
  return (
    <div>
      <Link to={'/create-cards'}>Create new cards</Link>
      <CardsList/>
    </div>
  );
};
