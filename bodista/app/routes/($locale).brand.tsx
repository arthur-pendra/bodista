import type {MetaFunction} from 'react-router';
import {BrandGuide} from '~/components/brand/BrandGuide';

export const meta: MetaFunction = () => {
  return [{title: 'Bodista · Typography System'}];
};

export default function Brand() {
  return <BrandGuide />;
}
