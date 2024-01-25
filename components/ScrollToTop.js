import tw, { styled } from 'twin.macro';
import { useRef } from 'react';

import useScrollToTop from '../hooks/useScrollToTop';

const ScrollToTopWrapper = styled.button`
  ${tw`bg-green-600 hidden fixed justify-center items-center right-8 md:right-12 bottom-8 rounded-full text-white text-3xl w-16 h-16 md:w-16 md:h-16`};

  svg {
    ${tw`h-10 w-10`};
  }
`;

const ScrollToTop = () => {
  const scrollToTopRef = useRef();

  useScrollToTop({
		ref: scrollToTopRef,
		display: 'flex'
	});

  return (
    <ScrollToTopWrapper type="button" ref={scrollToTopRef} className="scroll-selector">
		  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
			  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
		  </svg>
	  </ScrollToTopWrapper>
  )
};

export default ScrollToTop;