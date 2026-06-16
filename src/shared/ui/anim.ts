import type { Variants } from 'framer-motion';

// Ease-out cubic — natural, nada brusco
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const EASE_IN: [number, number, number, number] = [0.55, 0.06, 0.68, 0.19];

/**
 * Overlay flotante (mini ↔ panel ↔ chat).
 * mode="wait" en AnimatePresence garantiza que solo uno existe en el DOM a la vez.
 * Sin scale — solo opacity + y mínimo para anclaje al bottom.
 * Exit rápido (100ms) para que la espera sea imperceptible.
 */
export const overlayVariants: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_IN } },
};

/**
 * Sub-paneles (ActividadesPendientes, Buscador, Calendario).
 * Todos position:absolute para no cambiar altura del layout padre.
 * Emergen desde ligeramente abajo del input.
 */
export const subPanelVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_IN } },
};

/**
 * Historial drawer — desliza desde la derecha como overlay.
 * Spring para que se sienta físico pero sin rebote.
 */
export const drawerVariants: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { type: 'spring', stiffness: 380, damping: 38 } },
  exit: { x: '100%', transition: { duration: 0.2, ease: EASE_IN } },
};

/**
 * Cambio de prototipo (iconos sidebar).
 */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_IN } },
};
