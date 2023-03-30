import type { EffectCallback} from 'react';
import { useEffect } from 'react';

const useMount = (effect: EffectCallback) => {
  useEffect(effect, []);
};

export default useMount;