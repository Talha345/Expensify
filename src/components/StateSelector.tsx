import {useIsFocused} from '@react-navigation/native';
import {CONST as COMMON_CONST} from 'expensify-common/lib/CONST';
import React, {useEffect, useRef, useState} from 'react';
import type {ForwardedRef} from 'react';
import {View} from 'react-native';
import useGeographicalStateFromRoute from '@hooks/useGeographicalStateFromRoute';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import type {MaybePhraseKey} from '@libs/Localize';
import Navigation from '@libs/Navigation/Navigation';
import ROUTES from '@src/ROUTES';
import FormHelpMessage from './FormHelpMessage';
import type {MenuItemProps} from './MenuItem';
import MenuItemWithTopDescription from './MenuItemWithTopDescription';

type State = keyof typeof COMMON_CONST.STATES;

type StateSelectorProps = {
    /** Form error text. e.g when no state is selected */
    errorText?: MaybePhraseKey;

    /** Current selected state  */
    value?: State | '';

    /** Callback to call when the input changes */
    onInputChange?: (value: string) => void;

    /** Label to display on field */
    label?: string;

    /** Any additional styles to apply */
    wrapperStyle?: MenuItemProps['wrapperStyle'];

    /** Callback to call when the picker modal is dismissed */
    onBlur?: () => void;

    /** object to get route details from */
    stateSelectorRoute?: typeof ROUTES.SETTINGS_ADDRESS_STATE | typeof ROUTES.MONEY_REQUEST_STATE_SELECTOR;
};

function StateSelector(
    {errorText, onBlur, value: stateCode, label, onInputChange, wrapperStyle, stateSelectorRoute = ROUTES.SETTINGS_ADDRESS_STATE}: StateSelectorProps,
    ref: ForwardedRef<View>,
) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const stateFromUrl = useGeographicalStateFromRoute();

    const didOpenStateSelector = useRef(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && didOpenStateSelector.current) {
            didOpenStateSelector.current = false;
            if (!stateFromUrl) {
                onBlur?.();
            }
        }

        if (!stateFromUrl) {
            return;
        }

        // This will cause the form to revalidate and remove any error related to country name
        if (onInputChange) {
            onInputChange(stateFromUrl);
        }

        Navigation.setParams({state: undefined});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateFromUrl, onBlur, isFocused]);

    const title = stateCode && Object.keys(COMMON_CONST.STATES).includes(stateCode) ? translate(`allStates.${stateCode}.stateName`) : '';
    const descStyle = title.length === 0 ? styles.textNormal : null;

    return (
        <View>
            <MenuItemWithTopDescription
                descriptionTextStyle={descStyle}
                ref={ref}
                shouldShowRightIcon
                title={title}
                // Label can be an empty string
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                description={label || translate('common.state')}
                onPress={() => {
                    const activeRoute = Navigation.getActiveRoute();
                    didOpenStateSelector.current = true;
                    Navigation.navigate(stateSelectorRoute.getRoute(stateCode, activeRoute, label));
                }}
                wrapperStyle={wrapperStyle}
            />
            <View style={styles.ml5}>
                <FormHelpMessage message={errorText} />
            </View>
        </View>
    );
}

StateSelector.displayName = 'StateSelector';

export default React.forwardRef(StateSelector);
