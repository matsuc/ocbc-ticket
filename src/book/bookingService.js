import axios from 'axios';

// 前置的預約函數
const beforeBook = async ({
  selectedLength,
  selectedDateTime,
  userId,
  selectedCourt,
  sessionId,
}) => {
  try {
    const payload = {
      Duration: selectedLength,
      RequiredNumberOfSlots: null,
      StartTime: selectedDateTime,
      UserId: userId,
      ZoneId: selectedCourt,
    };

    const response = await axios.post(
      '/api/clientportal2/FacilityBookings/WizardSteps/SetFacilityBookingDetailsWizardStep/Next',
      payload,
      {
        headers: {
          'Cp-Book-Facility-Session-Id': sessionId,
        },
        withCredentials: true,
      },
    );

    console.log(`成功鎖定預約，場地 ${selectedCourt}`);
    return response.data['Data']['RuleId']; // 返回 ruleId
  } catch (error) {
    console.error('無法鎖定預約:', error.message);
  }
};

// 預約函數
const booking = async ({
  selectedLength,
  selectedDateTime,
  userId,
  selectedCourt,
  sessionId,
  maxRetries = 20,
}) => {
  // 執行前置的預約步驟，獲得 ruleId
  let ruleId;
  try {
    ruleId = await beforeBook({
      selectedLength,
      selectedDateTime,
      userId,
      selectedCourt,
      sessionId,
    });
  } catch (error) {
    return { success: false, message: error.message };
  }

  let attempt = 0; // 嘗試次數
  let success = false; // 預約是否成功
  while (attempt < maxRetries && !success) {
    try {
      attempt++;
      const payload = {
        ruleId: ruleId,
        OtherCalendarEventBookedAtRequestedTime: false,
        HasUserRequiredProducts: false,
      };

      const response = await axios.post(
        '/api/clientportal2/FacilityBookings/WizardSteps/ChooseBookingRuleStep/Next',
        payload,
        {
          headers: {
            'Cp-Book-Facility-Session-Id': sessionId,
          },
          withCredentials: true,
        },
      );

      // 如果預約成功
      success = true;
      return {
        success: true,
        message: '預約成功',
        redirectUrl: response.data['Redirect'],
      };
    } catch (error) {
      if (attempt === maxRetries) {
        // 如果重試達到最大次數，返回失敗信息
        return {
          success: false,
          message: `預約失敗: ${error.message}`,
        };
      }

      // 如果還可以重試，記錄並繼續重試
      console.log(`預約失敗，重試中...（第 ${attempt} 次）`);
    }
  }
};

export default booking;
