import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function NewEvent(props: Props) {
  const { name, desc, redirectTo } = props;
  return (
    <div className="max-w-sm p-4 text-white bg-gray-800">
      <h2 className="text-4xl font-semibold capitalize title">{name}</h2>
      <p className="my-3 text-justify">{desc}</p>
      <hr className="border-dotted" />
      <Link
        to={redirectTo}
        className="block px-2 py-4 mt-2 text-center capitalize border-2 group-hover:font-semibold group-hover:bg-white group-hover:text-gray-900">
        view details
      </Link>
    </div>
  );
}

NewEvent.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  redirectTo: PropTypes.string.isRequired
};

type Props = PropTypes.InferProps<typeof NewEvent.propTypes>;

export default NewEvent;
