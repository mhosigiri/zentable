# Cursor for Slides

AI-powered presentation generation tool built with Next.js and AI SDK.

## Recent Updates

### 🎯 Image Generation Cost Optimization (Latest Fix)

**Problem**: During slide generation, the streaming AI was triggering multiple image generation calls as it typed partial `imagePrompt` content, causing excessive costs.

**Solution**: 
- Moved image generation to occur **only after streaming completes**
- Added duplicate call prevention with `isGeneratingImage` flag
- Added comprehensive logging for debugging

**Before**: Multiple calls during streaming (every 100ms throttle)
**After**: Single call after streaming completes

### 🧪 Test Pages Available

- `/test-title-bullets-image` - Test TitleWithBulletsAndImage component
- `/test-text-image` - Test TextAndImage component  
- `/test-image-text` - Test ImageAndText component

Each test page includes:
- Real-time image generation controls
- Prompt input field
- Loading states and error handling
- Console logging for debugging

## Environment Variables

Make sure to set:
```
REPLICATE_API_TOKEN=your_replicate_token_here
```

## Development

```bash
npm run dev
```

## Image Generation Flow

1. User generates slides using AI SDK `streamObject`
2. AI streams slide content including `imagePrompt`
3. **After streaming completes**, single image generation call is made
4. Generated image is displayed in slide

## Cost Optimization

- ✅ Single image generation call per slide
- ✅ Duplicate call prevention
- ✅ Comprehensive error handling
- ✅ Detailed logging for monitoring
