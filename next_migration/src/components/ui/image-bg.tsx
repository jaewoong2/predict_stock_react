'use client';

import { FastAverageColor } from 'fast-average-color';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

interface ImageWithBackgroundProps extends Omit<ImageProps, 'ref'> {
  containerClassName?: string;
  as?: 'link' | 'simple';
  title?: string;
  background?: boolean;
}

const ImageWithBackground: React.FC<ImageWithBackgroundProps> = ({
  containerClassName,
  background,
  title,
  as = 'link',
  ...props
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');

  useEffect(() => {
    if (!background) return;
    const fac = new FastAverageColor();

    const analyzeColor = async () => {
      if (imageRef.current) {
        try {
          const color = await fac.getColorAsync(imageRef.current);
          setBackgroundColor(color.hexa);
          setTextColor(color.isDark ? '#fff' : '#000');
        } catch (e) {
          console.error('Error analyzing color:', e);
        }
      }
    };

    if (imageRef.current?.complete) {
      analyzeColor();
    } else {
      imageRef.current?.addEventListener('load', analyzeColor);
    }

    return imageRef.current?.removeEventListener('load', analyzeColor);
  }, [props.src, background]);

  const content = (
    <div className={containerClassName} style={{ backgroundColor, color: textColor }}>
      <Image {...props} ref={imageRef as any} alt={props.alt} />
    </div>
  );

  if (as === 'link' && props.src) {
    return (
      <Link
        href={`/images?image=${props.src.toString()}&title=${title ?? '이미지'}`}
        className='aspect-square h-full w-auto'
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default ImageWithBackground;
