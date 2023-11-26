import React, {FC} from 'react';
import {CreateCardForm} from '../../../../features/createCard';
import {Link} from 'react-router-dom';

export const CreateCards: FC = () => {
  return (
    <div>
      <Link to={'/'}>Go home</Link>
      <CreateCardForm/>
    </div>
  );
};
