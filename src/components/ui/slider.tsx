import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@/lib/utils';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  /* base-ui passes a plain number, not number[] */
  onValueChange?: (value: number) => void;
  className?: string;
  'aria-label'?: string;
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn('w-full', className)}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      thumbAlignment="edge"
      onValueChange={(v) => onValueChange?.(v as number)}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none py-1">
        <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full bg-[#2a2a2a] h-1.5 w-full">
          <SliderPrimitive.Indicator className="bg-green-500 h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="relative block size-4 shrink-0 rounded-full border-2 border-green-500 bg-white shadow cursor-pointer after:absolute after:-inset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
