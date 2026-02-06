import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import env from '../../config/env';

interface LocalizationMessage {
  uuid: string;
  code: string;
  message: string;
  module: string;
  locale: string;
}

interface LocalizationResponse {
  messages: LocalizationMessage[];
}

interface ApplicationLogLocalizedTexts {
  // Header
  applicationLogTitle: string;
  commentHistorySubtitle: string;
  viewedByApplicantText: string;
  
  // Buttons
  previousText: string;
  homeText: string;
  addRequestText: string;
  downloadDocText: string;
  
  // Loading
  loadingText: string;
  
  // Log content
  applicationFilledText: string;
  siteInspectionCompletedText: string;
  gisDiscrepancyText: string;
  fieldsModifiedText: string;
  finalInspectionReportText: string;
  inspectionDescText: string;
  fireSafetyCertText: string;
  fieldVerificationCompletedText: string;
  fieldVerificationDescText: string;
  
  // Actor names
  agentKumarText: string;
  adminOfficeText: string;
}

export const useApplicationLogLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<ApplicationLogLocalizedTexts>({
    // Header
    applicationLogTitle: 'Application Log',
    commentHistorySubtitle: 'Comment and Request History for specific property',
    viewedByApplicantText: '(viewed by applicant)',
    
    // Buttons
    previousText: 'Previous',
    homeText: 'Home',
    addRequestText: 'Add Request',
    downloadDocText: 'Download Doc',
    
    // Loading
    loadingText: 'Loading...',
    
    // Log content
    applicationFilledText: 'Application Filled on',
    siteInspectionCompletedText: 'Site Inspection Completed on',
    gisDiscrepancyText: 'GIS survey found descrepancies.',
    fieldsModifiedText: 'Fields Modified:',
    finalInspectionReportText: 'Final Inspection Report',
    inspectionDescText: 'Inspection completed successfully. Property condition is good',
    fireSafetyCertText: 'Fire safety certificate and utility bills uploaded. All required documentation now complete.',
    fieldVerificationCompletedText: 'Field Verification Completed',
    fieldVerificationDescText: 'All field verifications completed. Property meets all compliance requirements. Recommended for final approval.',
    
    // Actor names
    agentKumarText: 'Agent Kumar',
    adminOfficeText: 'Admin Office',
  });

  const messageCodes = [
    // Header
    'application.log.title',
    'comment.history.subtitle',
    'viewed.by.applicant',
    
    // Buttons
    'previous.btn',
    'home.btn',
    'add.request.btn',
    'download.doc.btn',
    
    // Loading
    'loading.text',
    
    // Log content
    'application.filled.text',
    'site.inspection.completed.text',
    'gis.discrepancy.text',
    'fields.modified.text',
    'final.inspection.report.text',
    'inspection.desc.text',
    'fire.safety.cert.text',
    'field.verification.completed.text',
    'field.verification.desc.text',
    
    // Actor names
    'agent.kumar.text',
    'admin.office.text',
  ];

  const fetchLocalizedTexts = async (newLocale: string) => {
    try {
      // Convert locale to backend format if needed
      const backendLocale = newLocale.includes('_') ? newLocale : `${newLocale}_IN`;
      const codesParam = messageCodes.join(',');
      const url = `${env.LOCALIZATION_HOST}/localization/v1/messages?module=common&locale=${backendLocale}&codes=${codesParam}`;

      const response = await fetch(url, {
        headers: {
          'X-Tenant-ID': 'pg',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: LocalizationResponse = await response.json();
        // Create a map of messages by code
        const messageMap: Record<string, string> = {};
        data.messages.forEach(msg => {
          messageMap[msg.code] = msg.message;
        });
        
        // Update texts with values from API
        setTexts({
          // Header
          applicationLogTitle: messageMap['application.log.title'] || 'Application Log',
          commentHistorySubtitle: messageMap['comment.history.subtitle'] || 'Comment and Request History for specific property',
          viewedByApplicantText: messageMap['viewed.by.applicant'] || '(viewed by applicant)',
          
          // Buttons
          previousText: messageMap['previous.btn'] || 'Previous',
          homeText: messageMap['home.btn'] || 'Home',
          addRequestText: messageMap['add.request.btn'] || 'Add Request',
          downloadDocText: messageMap['download.doc.btn'] || 'Download Doc',
          
          // Loading
          loadingText: messageMap['loading.text'] || 'Loading...',
          
          // Log content
          applicationFilledText: messageMap['application.filled.text'] || 'Application Filled on',
          siteInspectionCompletedText: messageMap['site.inspection.completed.text'] || 'Site Inspection Completed on',
          gisDiscrepancyText: messageMap['gis.discrepancy.text'] || 'GIS survey found descrepancies.',
          fieldsModifiedText: messageMap['fields.modified.text'] || 'Fields Modified:',
          finalInspectionReportText: messageMap['final.inspection.report.text'] || 'Final Inspection Report',
          inspectionDescText: messageMap['inspection.desc.text'] || 'Inspection completed successfully. Property condition is good',
          fireSafetyCertText: messageMap['fire.safety.cert.text'] || 'Fire safety certificate and utility bills uploaded. All required documentation now complete.',
          fieldVerificationCompletedText: messageMap['field.verification.completed.text'] || 'Field Verification Completed',
          fieldVerificationDescText: messageMap['field.verification.desc.text'] || 'All field verifications completed. Property meets all compliance requirements. Recommended for final approval.',
          
          // Actor names
          agentKumarText: messageMap['agent.kumar.text'] || 'Agent Kumar',
          adminOfficeText: messageMap['admin.office.text'] || 'Admin Office',
        });
      }
    } catch (error) {
      console.error('Error fetching ApplicationLog localized texts:', error);
      console.warn('Using default texts due to API error');
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'kn' : 'en';
    setGlobalLocale(newLocale);
    fetchLocalizedTexts(newLocale);
  };

  const setLanguage = (newLocale: string) => {
    setGlobalLocale(newLocale);
    fetchLocalizedTexts(newLocale);
  };

  // Initial load and when locale changes from context
  useEffect(() => {
    fetchLocalizedTexts(locale);
  }, [locale]);

  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale
  };
};
