import { useEffect } from 'react';

const useScrollToTop = ({ selector, ref, display }) => {
	useEffect(() => {
		const toggleScrollToTopController = () => {
			if (selector && ref) {
				return console.error({
					description: 'Both "selector" and "ref" parameters cannot be used at the same time.',
					message: 'Instance of scrollToTop error.',
					status: 'error'
				})
			}

			let target = null;

			if (selector) target = document.querySelector(selector);
			if (ref) target = ref?.current;

			if ((target && typeof target !== 'object') || (display && typeof display !== 'string')) {
				return console.error({
					description: 'target parameters must be an HTML object. display must be a string and a valid CSS display value',
					message: 'Instance of scrollToTop error.',
					status: 'error'
				})
			}

			if (!target && !display) {
				return console.error({
					description: 'no valid parameters provided',
					message: 'Instance of scrollToTop error.',
					status: 'error'
				});
			}
			
			// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
			if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
				target.style.display = display;
				target.addEventListener('click', () => {
					scroll({
						behavior: 'smooth',
						top: 0
					});
				});
			} else {
				target.style.display = 'none';
			}
		};

		window.addEventListener('scroll', toggleScrollToTopController);
		toggleScrollToTopController();

		return () => window.removeEventListener('scroll', toggleScrollToTopController);
	}, []);
};

export default useScrollToTop;