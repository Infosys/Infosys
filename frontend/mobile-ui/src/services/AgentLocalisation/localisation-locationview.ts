import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import env from '../../config/env';

export interface LocationViewLocalizedTexts {
  previousText: string;
  newPropertyFormText: string;
  addLocationText: string;
  searchPlaceholderText: string;
  mapInstructionText: string;
  noShapesMessageText: string;
  selectedLocationText: string;
  mainLocationText: string;
  additionalMarkedAreasText: string;
  pinText: string;
  rectangleText: string;
  polygonText: string;
  verticesText: string;
  noAdditionalAreasText: string;
  locationSavedOnText: string;
  atText: string;
  confirmLocationText: string;
}

// Hardcoded translations for Hindi and Kannada
function getHardcodedTranslation(code: string, locale: string): string {
  const translations: { [key: string]: { [locale: string]: string } } = {
    'location.view.previous': {
      hi: 'पिछला',
      kn: 'ಹಿಂದಿನ'
    },
    'location.view.new.property.form': {
      hi: 'नया संपत्ति फॉर्म',
      kn: 'ಹೊಸ ಆಸ್ತಿ ಫಾರ್ಮ್'
    },
    'location.view.add.location': {
      hi: 'स्थान जोड़ें',
      kn: 'ಸ್ಥಳವನ್ನು ಸೇರಿಸಿ'
    },
    'location.view.search.placeholder': {
      hi: 'खोजें',
      kn: 'ಹುಡುಕಿ'
    },
    'location.view.map.instruction': {
      hi: 'पिन की स्थिति के लिए मानचित्र को स्थानांतरित करें',
      kn: 'ಪಿನ್ ಸ್ಥಾನಗೊಳಿಸಲು ನಕ್ಷೆಯನ್ನು ಸರಿಸಿ'
    },
    'location.view.no.shapes.message': {
      hi: '📍 केवल मुख्य स्थान पिन दिखाया गया है। कोई अतिरिक्त क्षेत्र या सीमाएं नहीं खींची गई थीं।',
      kn: '📍 ಮುಖ್ಯ ಸ್ಥಳದ ಪಿನ್ ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಪ್ರದೇಶಗಳು ಅಥವಾ ಗಡಿಗಳನ್ನು ಚಿತ್ರಿಸಲಾಗಿಲ್ಲ.'
    },
    'location.view.selected.location': {
      hi: 'चयनित स्थान',
      kn: 'ಆಯ್ಕೆಮಾಡಿದ ಸ್ಥಳ'
    },
    'location.view.main.location': {
      hi: '📍 मुख्य स्थान',
      kn: '📍 ಮುಖ್ಯ ಸ್ಥಳ'
    },
    'location.view.additional.marked.areas': {
      hi: 'अतिरिक्त चिह्नित क्षेत्र',
      kn: 'ಹೆಚ್ಚುವರಿ ಗುರುತಿಸಲಾದ ಪ್ರದೇಶಗಳು'
    },
    'location.view.pin': {
      hi: '📍 पिन',
      kn: '📍 ಪಿನ್'
    },
    'location.view.rectangle': {
      hi: '▢ आयत',
      kn: '▢ ಆಯತ'
    },
    'location.view.polygon': {
      hi: '▽ बहुभुज',
      kn: '▽ ಬಹುಭುಜಾಕೃತಿ'
    },
    'location.view.vertices': {
      hi: 'शीर्ष',
      kn: 'ಶೃಂಗಗಳು'
    },
    'location.view.no.additional.areas': {
      hi: 'कोई अतिरिक्त क्षेत्र या सीमाएं चिह्नित नहीं की गईं। मानचित्र पर केवल मुख्य स्थान पिन दिखाया गया है।',
      kn: 'ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಪ್ರದೇಶಗಳು ಅಥವಾ ಗಡಿಗಳನ್ನು ಗುರುತಿಸಲಾಗಿಲ್ಲ. ನಕ್ಷೆಯಲ್ಲಿ ಮುಖ್ಯ ಸ್ಥಳದ ಪಿನ್ ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ.'
    },
    'location.view.location.saved.on': {
      hi: 'स्थान सहेजा गया',
      kn: 'ಸ್ಥಳವನ್ನು ಉಳಿಸಲಾಗಿದೆ'
    },
    'location.view.at': {
      hi: 'पर',
      kn: 'ನಲ್ಲಿ'
    },
    'location.view.confirm.location': {
      hi: 'स्थान की पुष्टि करें',
      kn: 'ಸ್ಥಳವನ್ನು ದೃಢೀಕರಿಸಿ'
    }
  };

  return translations[code]?.[locale] || '';
}

// Message codes array
const MESSAGE_CODES = [
  'location.view.previous',
  'location.view.new.property.form',
  'location.view.add.location',
  'location.view.search.placeholder',
  'location.view.map.instruction',
  'location.view.no.shapes.message',
  'location.view.selected.location',
  'location.view.main.location',
  'location.view.additional.marked.areas',
  'location.view.pin',
  'location.view.rectangle',
  'location.view.polygon',
  'location.view.vertices',
  'location.view.no.additional.areas',
  'location.view.location.saved.on',
  'location.view.at',
  'location.view.confirm.location'
];

// Function to fetch localized messages from API
async function fetchLocalizedMessages(locale: string): Promise<{ [key: string]: string }> {
  try {
    const codesParam = MESSAGE_CODES.join(',');
    const response = await fetch(
      `${env.LOCALIZATION_HOST}/localization/v1/messages?module=common&locale=${locale}&codes=${codesParam}`,
      {
        method: 'GET',
        headers: {
          'X-Tenant-ID': 'pg',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch localized messages from API');
      return {};
    }

    const data = await response.json();
    const messageMap: { [key: string]: string } = {};
    
    if (data && Array.isArray(data.messages)) {
      data.messages.forEach((msg: { code: string; message: string }) => {
        messageMap[msg.code] = msg.message;
      });
    }

    return messageMap;
  } catch (error) {
    console.error('Error fetching localized messages:', error);
    return {};
  }
}

// Custom hook for LocationView localization
export function useLocationViewLocalization(): LocationViewLocalizedTexts {
  const { locale } = useLanguage();
  const [texts, setTexts] = useState<LocationViewLocalizedTexts>({
    previousText: 'Previous',
    newPropertyFormText: 'New Property Form',
    addLocationText: 'Add Location',
    searchPlaceholderText: 'Search',
    mapInstructionText: 'Move the map to position the pin',
    noShapesMessageText: '📍 Only the main location pin is shown. No additional areas or boundaries were drawn.',
    selectedLocationText: 'Selected Location',
    mainLocationText: '📍 Main Location',
    additionalMarkedAreasText: 'Additional Marked Areas',
    pinText: '📍 Pin',
    rectangleText: '▢ Rectangle',
    polygonText: '▽ Polygon',
    verticesText: 'vertices',
    noAdditionalAreasText: 'No additional areas or boundaries were marked. Only the main location pin is shown on the map.',
    locationSavedOnText: 'Location saved on',
    atText: 'at',
    confirmLocationText: 'Confirm Location'
  });

  useEffect(() => {
    const loadLocalizations = async () => {
      const messageMap = await fetchLocalizedMessages(locale);

      setTexts({
        previousText: messageMap['location.view.previous'] || getHardcodedTranslation('location.view.previous', locale) || 'Previous',
        newPropertyFormText: messageMap['location.view.new.property.form'] || getHardcodedTranslation('location.view.new.property.form', locale) || 'New Property Form',
        addLocationText: messageMap['location.view.add.location'] || getHardcodedTranslation('location.view.add.location', locale) || 'Add Location',
        searchPlaceholderText: messageMap['location.view.search.placeholder'] || getHardcodedTranslation('location.view.search.placeholder', locale) || 'Search',
        mapInstructionText: messageMap['location.view.map.instruction'] || getHardcodedTranslation('location.view.map.instruction', locale) || 'Move the map to position the pin',
        noShapesMessageText: messageMap['location.view.no.shapes.message'] || getHardcodedTranslation('location.view.no.shapes.message', locale) || '📍 Only the main location pin is shown. No additional areas or boundaries were drawn.',
        selectedLocationText: messageMap['location.view.selected.location'] || getHardcodedTranslation('location.view.selected.location', locale) || 'Selected Location',
        mainLocationText: messageMap['location.view.main.location'] || getHardcodedTranslation('location.view.main.location', locale) || '📍 Main Location',
        additionalMarkedAreasText: messageMap['location.view.additional.marked.areas'] || getHardcodedTranslation('location.view.additional.marked.areas', locale) || 'Additional Marked Areas',
        pinText: messageMap['location.view.pin'] || getHardcodedTranslation('location.view.pin', locale) || '📍 Pin',
        rectangleText: messageMap['location.view.rectangle'] || getHardcodedTranslation('location.view.rectangle', locale) || '▢ Rectangle',
        polygonText: messageMap['location.view.polygon'] || getHardcodedTranslation('location.view.polygon', locale) || '▽ Polygon',
        verticesText: messageMap['location.view.vertices'] || getHardcodedTranslation('location.view.vertices', locale) || 'vertices',
        noAdditionalAreasText: messageMap['location.view.no.additional.areas'] || getHardcodedTranslation('location.view.no.additional.areas', locale) || 'No additional areas or boundaries were marked. Only the main location pin is shown on the map.',
        locationSavedOnText: messageMap['location.view.location.saved.on'] || getHardcodedTranslation('location.view.location.saved.on', locale) || 'Location saved on',
        atText: messageMap['location.view.at'] || getHardcodedTranslation('location.view.at', locale) || 'at',
        confirmLocationText: messageMap['location.view.confirm.location'] || getHardcodedTranslation('location.view.confirm.location', locale) || 'Confirm Location'
      });
    };

    loadLocalizations();
  }, [locale]);

  return texts;
}
