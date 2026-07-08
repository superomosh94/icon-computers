import { shop } from '../../lib/config';
import { PhoneIcon } from '../ui/Icons';
import './StickyCallButton.css';

export default function StickyCallButton() {
  return (
    <a href={`tel:${shop.phone}`} className="sticky-call">
      <PhoneIcon size={18} />
      Call Us
    </a>
  );
}
