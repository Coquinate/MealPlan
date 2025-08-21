#!/bin/bash

# Fix icon imports from lucide-react to @tabler/icons-react
cd src/components

# Checkbox
sed -i 's/CheckIcon/IconCheck/g' ui/checkbox.tsx

# Email capture
sed -i 's/CheckCircle/IconCircleCheck/g' email-capture.tsx
sed -i 's/AlertCircle/IconAlertCircle/g' email-capture.tsx  
sed -i 's/Loader2/IconLoader2/g' email-capture.tsx

# Footer
sed -i 's/Facebook/IconBrandFacebook/g' footer.tsx
sed -i 's/Instagram/IconBrandInstagram/g' footer.tsx
sed -i 's/Twitter/IconBrandTwitter/g' footer.tsx
sed -i 's/Mail/IconMail/g' footer.tsx
sed -i 's/Heart/IconHeart/g' footer.tsx

# Share components
sed -i 's/Share2/IconShare2/g' floating-share.tsx share-component.tsx
sed -i 's/X/IconX/g' floating-share.tsx
sed -i 's/Facebook/IconBrandFacebook/g' share-component.tsx
sed -i 's/MessageCircle/IconMessageCircle/g' share-component.tsx
sed -i 's/Copy/IconCopy/g' share-component.tsx
sed -i 's/Check/IconCheck/g' share-component.tsx

# Progress indicator
sed -i 's/Users/IconUsers/g' progress-indicator.tsx
sed -i 's/TrendingUp/IconTrendingUp/g' progress-indicator.tsx

# Sound toggle
sed -i 's/Volume2/IconVolume2/g' sound-toggle.tsx
sed -i 's/VolumeX/IconVolumeX/g' sound-toggle.tsx

# Workflow visualization
sed -i 's/ChefHat/IconChefHat/g' workflow-visualization.tsx
sed -i 's/FileText/IconFileText/g' workflow-visualization.tsx
sed -i 's/Layers/IconStack2/g' workflow-visualization.tsx
sed -i 's/ArrowDown/IconArrowDown/g' workflow-visualization.tsx

# Features section
sed -i 's/MapPin/IconMapPin/g' features-section.tsx
sed -i 's/ClipboardCheck/IconClipboardCheck/g' features-section.tsx
sed -i 's/CheckCircle/IconCircleCheck/g' features-section.tsx
sed -i 's/ChefHat/IconChefHat/g' features-section.tsx

echo "Icon imports fixed!"