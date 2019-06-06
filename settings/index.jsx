function Settings(props) {
    return <Page>
        <Section title={<Text bold align="center">Sync</Text>}>
            <TextInput label="Sync token" settingsKey="sync-token"/>
        </Section>
    </Page>;
}

registerSettingsPage(Settings);
