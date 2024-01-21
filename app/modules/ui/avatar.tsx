import * as React from "react"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva } from "class-variance-authority";

import { cn } from "~/utils/utils"

const avatarVariants = cva(
	"relative flex shrink-0 overflow-hidden rounded-full",
	{
		variants: {
			size: {
				default: "w-10 h-10",
				sm: "w-8 h-8",
				lg: "w-48 h-48",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

type AvatarElement = React.ElementRef<typeof AvatarPrimitive.Root>;
type AvatarProps = React.ComponentPropsWithoutRef<
	typeof AvatarPrimitive.Root
> & {
	size?: "sm" | "lg" | "default";
};

const Avatar = React.forwardRef<AvatarElement, AvatarProps>(
	({ className, size = "default", ...props }, ref) => (
		<AvatarPrimitive.Root
			ref={ref}
			className={cn(avatarVariants({ size }), className)}
			{...props}
		/>
	),
);
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
