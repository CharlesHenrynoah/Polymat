import { ModelCategory } from '../types/models';

export const modelCategories: ModelCategory[] = [
  {
    id: 'text-to-video',
    name: 'Text → Video',
    description: 'Generate videos from text descriptions',
    icon: '🎥',
    requiresAttachment: false,
    models: [
      {
        id: 'text-to-video-1',
        name: 'VideoGen Pro',
        description: 'High-quality video generation from detailed text descriptions',
        category: 'text-to-video'
      },
      // Add more models as needed
    ]
  },
  {
    id: 'text-to-music',
    name: 'Text → Music',
    description: 'Create music from text instructions',
    icon: '🎵',
    requiresAttachment: false,
    models: [
      {
        id: 'text-to-music-1',
        name: 'MusicGen AI',
        description: 'Generate musical compositions from text prompts',
        category: 'text-to-music'
      },
    ]
  },
  {
    id: 'text-to-code',
    name: 'Text → Code',
    description: 'Generate code from text descriptions',
    icon: '💻',
    requiresAttachment: false,
    models: [
      {
        id: 'text-to-code-1',
        name: 'CodeGen AI',
        description: 'Generate code in multiple programming languages',
        category: 'text-to-code'
      },
    ]
  },
  {
    id: 'text-to-image',
    name: 'Text → Image',
    description: 'Create images from text descriptions',
    icon: '🎨',
    requiresAttachment: false,
    models: [
      {
        id: 'text-to-image-1',
        name: 'ImageGen Pro',
        description: 'Generate high-quality images from text descriptions',
        category: 'text-to-image'
      },
    ]
  },
  {
    id: 'text-to-speech',
    name: 'Text → Speech',
    description: 'Convert text to natural-sounding speech',
    icon: '🗣️',
    requiresAttachment: false,
    models: [
      {
        id: 'text-to-speech-1',
        name: 'VoiceGen AI',
        description: 'Natural text-to-speech conversion with multiple voices',
        category: 'text-to-speech'
      },
    ]
  },
  {
    id: 'multimodal',
    name: 'Multimodal',
    description: 'Process multiple types of input data',
    icon: '🔄',
    requiresAttachment: true,
    models: [
      {
        id: 'multimodal-1',
        name: 'MultiGen Pro',
        description: 'Process text, images, and other data types together',
        category: 'multimodal'
      },
    ]
  },
  {
    id: 'image-to-image',
    name: 'Image + Text → Image',
    description: 'Modify images using text instructions',
    icon: '🖼️',
    requiresAttachment: true,
    models: [
      {
        id: 'image-to-image-1',
        name: 'ImageEdit Pro',
        description: 'Edit and transform images using text instructions',
        category: 'image-to-image'
      },
    ]
  },
  {
    id: 'image-to-video',
    name: 'Image + Text → Video',
    description: 'Create videos from images and text',
    icon: '📽️',
    requiresAttachment: true,
    models: [
      {
        id: 'image-to-video-1',
        name: 'VideoTransform AI',
        description: 'Transform images into videos with text guidance',
        category: 'image-to-video'
      },
    ]
  }
];