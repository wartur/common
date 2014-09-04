/**
 * Алгоритм распределения пропорции...
 * @todo нужно причесать унифицировать...
 * 
 * Процедура подсчета равномерного распределения скидки по указанным позициям
 * @param {Array} position ассоц массив key - уникальный идентификатор, data - цена на которую надо сделать распределение
 * @param {String} proportionAmount количество скидки, которую надо распределить
 * @returns {Array} расширенный массив position, с доп информацией по распределению
 */
function _calculateProportion(position, proportionAmount)
{
	// если нет скидки, возвращать
	if(proportionAmount == null || proportionAmount == '0.00')
	{
		return false;
	}
	
	// если нет товаров, то возвращяем пустые начисления
	if(Object.keys(position).length <= 0) {
		return {};
	}
	
	/*
	if(Object.keys(position).length <= 0)
	{
		send_error(new Error('CUSTOM: Массив продаж должен содержать хотя бы один элемент'));
		return false;
	}
	*/
	
	var result = jQuery.extend(true, {}, position);
	var sumFloat = 0;
	var proportionAmountFloat = parseFloat(proportionAmount);
	
	for(var key in result)
	{
		var entry = result[key];
		
		entry.amountFloat = parseFloat(entry.amount);
		
		sumFloat += entry.amountFloat;
	}
	
	var sum = CommonLib.convertFinanceStringWithCent(sumFloat);
	
	// получим пропорцию
	if(proportionAmountFloat > sumFloat)
	{
		send_error(new Error('CUSTOM: Ошибка. Распределяемая сумма больше, чем сумма на которую требуется распределить'));
		return false;
	}
	
	var proportionFloat = proportionAmountFloat / sumFloat;
	var presumFloat = 0;

	for(var key in result)
	{
		var entry = result[key];
		
		entry.discountFloat = entry.amountFloat * proportionFloat;
		
		// с округлением
		entry.discount = CommonLib.convertFinanceStringWithCent(entry.discountFloat);
		
		// предварительная сумма
		presumFloat += parseFloat(entry.discount);
	}
	
	var presum = CommonLib.convertFinanceStringWithCent(presumFloat);
	var diffFloat = proportionAmount - presum;
	
	if(diffFloat > 0)
	{
		// в этом случае мы складываем со скидкой
		var workDiffFloat = diffFloat;
		
		// попробуем приапплаить оставшуюся сумму по всем товарам которым сможем
		for(var key in result)
		{
			// если вся сумма распределилась, то останавливаем алгоритм распределения
			if(workDiffFloat === 0)
				break;

			var entry = result[key];

			var maxApplyFloat = entry.amount - entry.discount;

			if(maxApplyFloat >= workDiffFloat)
			{
				// если возможнсть для полного апплая есть
				entry.extdiscountFloat = workDiffFloat;
				workDiffFloat -= workDiffFloat;
			}
			else
			{
				// или добавляем все что можем добавить
				entry.extdiscountFloat = maxApplyFloat;
				workDiffFloat -= maxApplyFloat;
			}
			
			entry.extdiscount = CommonLib.convertFinanceStringWithCent(entry.extdiscountFloat);
			entry.discount = CommonLib.convertFinanceStringWithCent(parseFloat(entry.discount) + entry.extdiscountFloat);
		}
		
		if(workDiffFloat !== 0)
		{
			send_error(new Error('CUSTOM: Ошибка. Неудалось распределить остаточную сумму'));
			return false;
		}
	}
	else if(diffFloat < 0)
	{
		// в этом случае мы вычитаем из скидки
		
		var workDiffFloat = -diffFloat;		// переведем в положительное значение
		
		// попробуем приапплаить оставшуюся сумму по всем товарам которым сможем
		for(var key in result)
		{
			// если вся сумма распределилась, то останавливаем алгоритм распределения
			if(workDiffFloat === 0)
				break;

			var entry = result[key];

			var discountFloat = parseFloat(entry.discount);

			if(discountFloat >= workDiffFloat)
			{
				// если возможнсть для полного вычета
				entry.extdiscountFloat = -workDiffFloat;
				workDiffFloat -= workDiffFloat;
			}
			else
			{
				// или вычитаем все что можем вычесть, то есть до ноля
				entry.extdiscountFloat = -discountFloat;
				workDiffFloat -= discountFloat;
			}
			
			entry.extdiscount = CommonLib.convertFinanceStringWithCent(entry.extdiscountFloat);
			entry.discount = CommonLib.convertFinanceStringWithCent(parseFloat(entry.discount) + entry.extdiscountFloat);
		}
		
		if(workDiffFloat !== 0)
		{
			send_error(new Error('CUSTOM: Ошибка. Неудалось распределить остаточную сумму'));
			return false;
		}
	}
	else
	{
		// равен нулю, значит ничего доначислять не надо
	}
	
	return result;
}
